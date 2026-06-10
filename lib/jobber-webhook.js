import { createHmac, timingSafeEqual } from 'node:crypto'

import { jobberGraphQL, serviceSupabase } from './jobber'
import { dateOnly, sumParts, statusFromInvoice } from './jobber-invoices'

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
      salesperson { name { full } }
    }
  }
`

// salesperson.name may be an object { full } (Jobber's User name) or, defensively,
// a plain string. Returns the display name or null.
function salespersonName(request) {
  const n = request?.salesperson?.name
  if (!n) return null
  if (typeof n === 'string') return n
  return n.full ?? null
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
      lineItems(first: 50) {
        nodes { name quantity originalCost }
      }
      jobs { nodes { id request { id createdAt salesperson { name { full } } } } }
    }
  }
`

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

// REQUEST_CREATE: insert an "upcoming" row keyed on the request id. If a row
// with that jobber_request_id already exists, do nothing.
async function handleRequestCreate(itemId) {
  const data = await jobberGraphQL(REQUEST_BY_ID, { id: itemId })
  const req = data?.request
  if (!req?.id) {
    return { action: 'skipped', reason: 'request_not_found', itemId }
  }

  const row = {
    jobber_request_id: req.id,
    customer_name: req.client?.name ?? null,
    report_date: dateOnly(req.createdAt),
    technician_name: salespersonName(req),
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
  const data = await jobberGraphQL(INVOICE_BY_ID, { id: itemId })
  const inv = data?.invoice
  if (!inv?.id) {
    return { action: 'skipped', reason: 'invoice_not_found', itemId }
  }

  const job = inv.jobs?.nodes?.[0] || null
  const jobId = job?.id ?? null
  const requestId = job?.request?.id ?? null
  const requestCreatedAt = job?.request?.createdAt ?? null
  const technician = salespersonName(job?.request)

  const invoiceNumber = inv.invoiceNumber != null ? String(inv.invoiceNumber) : null
  const saleAmount = inv.amounts?.total ?? null
  const parts = sumParts(inv.lineItems?.nodes)
  const status = statusFromInvoice(inv.invoiceStatus)

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
      // salesperson when we have one — but never null it out here (preserve a
      // value set at request time / manually) when salesperson is missing.
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
