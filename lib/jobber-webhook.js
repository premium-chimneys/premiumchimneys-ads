import { createHmac, timingSafeEqual } from 'node:crypto'

import { jobberGraphQLRaw, serviceSupabase } from './jobber'
import { dateOnly, statusFromInvoice } from './jobber-invoices'

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
      assessment { assignedUsers(first: 5) { nodes { name { full } } } }
    }
  }
`

// The assigned team member(s) live on the request's assessment. Joins multiple
// assignees with ", "; returns null when there's no assessment or no assigned
// users. Each user's name may be an object { full } or, defensively, a string.
function assignedTechnician(request) {
  const nodes = request?.assessment?.assignedUsers?.nodes
  if (!Array.isArray(nodes) || nodes.length === 0) return null
  const names = nodes
    .map((u) => {
      const n = u?.name
      if (!n) return null
      return typeof n === 'string' ? n : n.full ?? null
    })
    .filter(Boolean)
  return names.length ? names.join(', ') : null
}

const INVOICE_BY_ID = `
  query InvoiceById($id: EncodedId!) {
    invoice(id: $id) {
      id
      invoiceNumber
      invoiceStatus
      createdAt
      client { name }
      amounts { total }
      jobs {
        nodes {
          id
          request { id createdAt assessment { assignedUsers(first: 5) { nodes { name { full } } } } }
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

  const row = {
    jobber_request_id: req.id,
    customer_name: req.client?.name ?? null,
    report_date: dateOnly(req.createdAt),
    technician_name: assignedTechnician(req),
    status: 'upcoming',
  }

  const { error } = await serviceSupabase()
    .from('income_report')
    .upsert(row, { onConflict: 'jobber_request_id', ignoreDuplicates: true })
  if (error) throw new Error(`income_report request insert failed: ${error.message}`)

  return { action: 'request_upserted', jobber_request_id: req.id }
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
  const technician = assignedTechnician(job?.request)

  const invoiceNumber = inv.invoiceNumber != null ? String(inv.invoiceNumber) : null
  const saleAmount = inv.amounts?.total ?? null
  const status = statusFromInvoice(inv.invoiceStatus)

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
        status,
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
      status,
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
    status,
  }
  const { error } = await db
    .from('income_report')
    .upsert(row, { onConflict: 'jobber_id' })
  if (error) throw new Error(`income_report invoice upsert failed: ${error.message}`)
  return { action: 'upserted_by_invoice', jobber_id: invoiceNumber }
}

// Dispatch by topic. Unknown topics are acknowledged and ignored.
export async function processWebhookEvent({ topic, itemId }) {
  switch (topic) {
    case 'REQUEST_CREATE':
      return handleRequestCreate(itemId)
    case 'INVOICE_CREATE':
    case 'INVOICE_UPDATE':
      return handleInvoiceUpsert(itemId)
    default:
      return { action: 'ignored', topic }
  }
}
