import { createHmac, timingSafeEqual } from 'node:crypto'

import { jobberGraphQLRaw, serviceSupabase } from './jobber'
import {
  dateOnly,
  statusFromInvoice,
  assignedTechnician,
  resolveTechnician,
  assignedUserIds,
  classifyReportType,
} from './jobber-invoices'

// Jobber webhook processing for the income_report table.
//
// Jobber signs each webhook with a base64 HMAC-SHA256 of the RAW body, keyed
// with the app's OAuth client secret, in the X-Jobber-Hmac-SHA256 header. The
// payload is { data: { webHookEvent: { topic, itemId, ... } } } where itemId is
// an EncodedId usable directly in GraphQL lookups.

// ---------------------------------------------------------------------------
// Signature verification
// ---------------------------------------------------------------------------

export function verifyJobberSignature(rawBody, signature) {
  const secret = process.env.JOBBER_CLIENT_SECRET
  if (!secret || !signature) return false

  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')
  const a = Buffer.from(expected)
  const b = Buffer.from(String(signature))
  // Length check first — timingSafeEqual throws on differing lengths.
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

// ---------------------------------------------------------------------------
// GraphQL lookups
// ---------------------------------------------------------------------------

const REQUEST_BY_ID = `
  query RequestById($id: EncodedId!) {
    request(id: $id) {
      id
      createdAt
      client { name }
      assessment { assignedUsers(first: 10) { nodes { id name { full } } } }
    }
  }
`

// assignedTechnician now lives in ./jobber-invoices (shared with the sync and
// backfill); imported above.

const INVOICE_BY_ID = `
  query InvoiceById($id: EncodedId!) {
    invoice(id: $id) {
      id
      invoiceNumber
      invoiceStatus
      createdAt
      client { name }
      amounts { total }
      salesperson { name { full } }
      jobs {
        nodes {
          id
          request { id createdAt assessment { assignedUsers(first: 10) { nodes { id name { full } } } } }
        }
      }
    }
  }
`

// Second, cheaper query: just the job's line-item costs. Split out from the
// invoice query so neither call exceeds Jobber's per-query cost limit.
const JOB_LINE_ITEMS_BY_ID = `
  query JobLineItems($id: EncodedId!) {
    job(id: $id) {
      lineItems(first: 100) { nodes { totalCost } }
    }
  }
`

// Σ of the job's line-item totalCost (null counts as 0).
function jobPartsCost(job) {
  const nodes = job?.lineItems?.nodes || []
  return nodes.reduce((sum, li) => sum + (Number(li?.totalCost) || 0), 0)
}

// ---------------------------------------------------------------------------
// GraphQL call with throttle-aware retry
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Jobber rate limiting: HTTP 429, or a GraphQL error with extensions.code
// === 'THROTTLED' (HTTP 200).
function isThrottled(res) {
  if (res?.status === 429) return true
  return (res?.errors || []).some((e) => {
    const code = e?.extensions?.code
    return code === 'THROTTLED' || /throttl/i.test(String(e?.message || ''))
  })
}

// Runs a GraphQL query, retrying on throttle up to 2 times with backoff
// (1s, 2s). Returns the data on success. Throws on a non-throttle error, or if
// still throttled after the retries — the caller lets that bubble so the
// webhook responds 500 and Jobber retries later.
async function graphqlWithRetry(query, variables) {
  for (let attempt = 0; ; attempt += 1) {
    const res = await jobberGraphQLRaw(query, variables)
    if (res.ok) return res.data

    if (isThrottled(res) && attempt < 2) {
      await sleep(1000 * 2 ** attempt) // 1s, 2s
      continue
    }

    throw new Error(
      `jobber: graphql failed (status ${res.status}${isThrottled(res) ? ', throttled' : ''}): ${JSON.stringify(res.errors)}`
    )
  }
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

// REQUEST_CREATE: insert an "upcoming" row keyed on the request id. If a row
// with that jobber_request_id already exists, do nothing.
async function handleRequestCreate(itemId) {
  const data = await graphqlWithRetry(REQUEST_BY_ID, { id: itemId })
  const req = data?.request
  if (!req?.id) {
    return { action: 'skipped', reason: 'request_not_found', itemId }
  }

  const userIds = assignedUserIds(req)
  const row = {
    jobber_request_id: req.id,
    customer_name: req.client?.name ?? null,
    report_date: dateOnly(req.createdAt),
    technician_name: assignedTechnician(req),
    job_stage: 'upcoming',
    payment: 'unpaid',
    assigned_user_ids: userIds,
    report_type: classifyReportType(userIds),
  }

  const { error } = await serviceSupabase()
    .from('income_report')
    .upsert(row, { onConflict: 'jobber_request_id', ignoreDuplicates: true })
  if (error) throw new Error(`income_report request insert failed: ${error.message}`)

  return { action: 'request_upserted', jobber_request_id: req.id }
}

// REQUEST_UPDATE: a request was edited after creation (e.g. an assignee added or
// reassigned). Reclassify the EXISTING row only — REQUEST_CREATE owns creation,
// so if no row matches jobber_request_id we do nothing (update touches 0 rows,
// never inserts). Only the three assignment-derived fields are written;
// sale_amount/parts/status are left to the invoice path.
async function handleRequestUpdate(itemId) {
  const data = await graphqlWithRetry(REQUEST_BY_ID, { id: itemId })
  const req = data?.request
  if (!req?.id) {
    return { action: 'skipped', reason: 'request_not_found', itemId }
  }

  const userIds = assignedUserIds(req)
  // assigned_user_ids/report_type always reflect current state; technician_name
  // only when resolved, so we don't wipe a salesperson-derived tech set by an
  // invoice event.
  const technician = assignedTechnician(req)
  const updateFields = {
    assigned_user_ids: userIds,
    report_type: classifyReportType(userIds),
  }
  if (technician != null) updateFields.technician_name = technician

  const { data: updated, error } = await serviceSupabase()
    .from('income_report')
    .update(updateFields)
    .eq('jobber_request_id', req.id)
    .select('id')
  if (error) throw new Error(`income_report request reclassify failed: ${error.message}`)

  return updated?.length
    ? { action: 'reclassified', jobber_request_id: req.id }
    : { action: 'skipped', reason: 'no_matching_row', jobber_request_id: req.id }
}

// INVOICE_CREATE / INVOICE_UPDATE: enrich/insert the row for this invoice.
// Correlate to the request row via the linked job's request id when present;
// otherwise dedupe by invoice number so repeated updates don't duplicate.
async function handleInvoiceUpsert(itemId) {
  const db = serviceSupabase()
  const data = await graphqlWithRetry(INVOICE_BY_ID, { id: itemId })
  const inv = data?.invoice
  if (!inv?.id) {
    return { action: 'skipped', reason: 'invoice_not_found', itemId }
  }

  const job = inv.jobs?.nodes?.[0] || null
  const jobId = job?.id ?? null
  const requestId = job?.request?.id ?? null
  const requestCreatedAt = job?.request?.createdAt ?? null
  // ① request assessment, else ② invoice salesperson (Quote-origin jobs).
  const technician = resolveTechnician(job?.request, inv?.salesperson)
  // Classification routes on the request's assessment assignees (empty when
  // there's no linked request -> internal/IIR fallback).
  const userIds = assignedUserIds(job?.request)
  const reportType = classifyReportType(userIds)

  const invoiceNumber = inv.invoiceNumber != null ? String(inv.invoiceNumber) : null
  const saleAmount = inv.amounts?.total ?? null
  // Invoiced rows are finished jobs: stage closed, payment from the invoice.
  const payment = statusFromInvoice(inv.invoiceStatus)

  // Parts cost comes from the job's line items — a separate, cheaper query so
  // neither call trips Jobber's per-query cost limit. Short delay first to ease
  // off the rate limiter.
  let parts = 0
  if (jobId) {
    await sleep(600)
    const jobData = await graphqlWithRetry(JOB_LINE_ITEMS_BY_ID, { id: jobId })
    parts = jobPartsCost(jobData?.job)
  }

  if (requestId) {
    // Find the request row created at REQUEST_CREATE time.
    const { data: existing, error: selError } = await db
      .from('income_report')
      .select('id')
      .eq('jobber_request_id', requestId)
      .maybeSingle()
    if (selError) throw new Error(`income_report lookup failed: ${selError.message}`)

    if (existing) {
      // Update the invoice-derived fields; leave customer_name/report_date
      // (set from the request) untouched. Backfill technician_name from the
      // assigned team member when we have one — but never null it out here
      // (preserve a value set at request time / manually) when none is assigned.
      const updateFields = {
        jobber_id: invoiceNumber,
        jobber_job_id: jobId,
        sale_amount: saleAmount,
        parts,
        job_stage: 'closed',
        payment,
        assigned_user_ids: userIds,
        report_type: reportType,
      }
      if (technician != null) updateFields.technician_name = technician

      const { error } = await db
        .from('income_report')
        .update(updateFields)
        .eq('id', existing.id)
      if (error) throw new Error(`income_report invoice update failed: ${error.message}`)
      return { action: 'updated', jobber_request_id: requestId, jobber_id: invoiceNumber }
    }

    // No request row yet — insert a complete one. Upsert on jobber_request_id so
    // a racing REQUEST_CREATE/INVOICE event can't create a duplicate.
    const row = {
      jobber_request_id: requestId,
      jobber_id: invoiceNumber,
      jobber_job_id: jobId,
      customer_name: inv.client?.name ?? null,
      report_date: dateOnly(requestCreatedAt || inv.createdAt),
      technician_name: technician,
      sale_amount: saleAmount,
      parts,
      job_stage: 'closed',
      payment,
      assigned_user_ids: userIds,
      report_type: reportType,
    }
    const { error } = await db
      .from('income_report')
      .upsert(row, { onConflict: 'jobber_request_id' })
    if (error) throw new Error(`income_report invoice insert failed: ${error.message}`)
    return { action: 'inserted_by_request', jobber_request_id: requestId }
  }

  // No linked request — dedupe by invoice number (jobber_id) so repeated
  // INVOICE_UPDATE events update the same row instead of duplicating.
  const row = {
    jobber_id: invoiceNumber,
    jobber_job_id: jobId,
    customer_name: inv.client?.name ?? null,
    report_date: dateOnly(inv.createdAt),
    sale_amount: saleAmount,
    parts,
    job_stage: 'closed',
    payment,
    assigned_user_ids: userIds,
    report_type: reportType,
  }
  const { error } = await db
    .from('income_report')
    .upsert(row, { onConflict: 'jobber_id' })
  if (error) throw new Error(`income_report invoice upsert failed: ${error.message}`)
  return { action: 'upserted_by_invoice', jobber_id: invoiceNumber }
}

// ---------------------------------------------------------------------------
// Maya fan-out (best-effort, fully isolated)
// ---------------------------------------------------------------------------
// When an invoice is paid, ALSO notify Maya's review campaign (a separate app,
// premiumchimneys-agents). This is intentionally decoupled from income_report:
// its own minimal contact query, its own error handling, and it runs AFTER the
// income_report work has completed. It must NEVER throw, never change the
// webhook's response, and never affect income reporting — that is the priority.

const MAYA_FANOUT_TIMEOUT_MS = 5000

// Minimal contact lookup — deliberately separate from INVOICE_BY_ID so the
// income_report query is untouched. Pulls only what enroll needs.
const MAYA_INVOICE_CONTACT = `
  query InvoiceContact($id: EncodedId!) {
    invoice(id: $id) {
      id
      invoiceNumber
      invoiceStatus
      client {
        name
        phones { number primary }
        emails { address primary }
      }
    }
  }
`

// Prefer the entry flagged primary, else the first; null if none.
function firstContact(list, field) {
  if (!Array.isArray(list) || list.length === 0) return null
  const primary = list.find((x) => x?.primary)
  return (primary || list[0])?.[field] || null
}

// Logged once when the env isn't configured, so the no-op path is quiet.
let mayaFanoutEnvWarned = false

async function fanOutToMaya(itemId) {
  try {
    const url = process.env.MAYA_ENROLL_URL
    const secret = process.env.MAYA_ENROLL_SECRET
    if (!url || !secret) {
      if (!mayaFanoutEnvWarned) {
        console.log(JSON.stringify({ evt: 'maya.fanout_disabled', reason: 'MAYA_ENROLL_URL/SECRET unset' }))
        mayaFanoutEnvWarned = true
      }
      return
    }

    // Non-throwing GraphQL — its own query, no retry (best-effort, must be fast).
    const res = await jobberGraphQLRaw(MAYA_INVOICE_CONTACT, { id: itemId })
    const inv = res?.data?.invoice
    if (!res?.ok || !inv?.id) return

    // Reuse the EXISTING paid detection — don't re-derive it differently.
    if (statusFromInvoice(inv.invoiceStatus) !== 'paid') return

    const name = inv.client?.name || 'there'
    const phone = firstContact(inv.client?.phones, 'number')
    const email = firstContact(inv.client?.emails, 'address')
    const invoiceId = inv.invoiceNumber != null ? String(inv.invoiceNumber) : inv.id

    if (!phone && !email) {
      console.log(JSON.stringify({ evt: 'maya.fanout_skipped', reason: 'no_contact', invoiceId }))
      return
    }

    // Hard timeout so a slow Maya endpoint can't delay the Jobber response.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), MAYA_FANOUT_TIMEOUT_MS)
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-maya-enroll-secret': secret },
        body: JSON.stringify({ name, phone, email, invoiceId }),
        signal: controller.signal,
      })
      console.log(JSON.stringify({ evt: 'maya.fanout', invoiceId, status: resp.status, ok: resp.ok }))
    } finally {
      clearTimeout(timer)
    }
  } catch (err) {
    // Swallow EVERYTHING. Maya enroll is best-effort; income_report is priority.
    console.error(JSON.stringify({ evt: 'maya.fanout_failed', err: err?.message || String(err) }))
  }
}

// Dispatch by topic. Unknown topics are acknowledged and ignored.
export async function processWebhookEvent({ topic, itemId }) {
  switch (topic) {
    case 'REQUEST_CREATE':
      return handleRequestCreate(itemId)
    case 'REQUEST_UPDATE':
      return handleRequestUpdate(itemId)
    case 'INVOICE_CREATE':
      return handleInvoiceUpsert(itemId)
    case 'INVOICE_UPDATE': {
      // income_report FIRST and unchanged — fully awaited before any fan-out.
      const result = await handleInvoiceUpsert(itemId)
      // Best-effort Maya notify. Isolated + swallowed; the result returned to the
      // webhook (and its HTTP response) is income_report's, never affected.
      await fanOutToMaya(itemId)
      return result
    }
    default:
      return { action: 'ignored', topic }
  }
}
