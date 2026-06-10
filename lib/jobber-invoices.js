import { jobberGraphQLRaw, serviceSupabase } from './jobber'

// Jobber -> income_report sync: a paginated pull of every invoice, mapped and
// upserted into income_report. The mapping helpers (dateOnly / sumParts /
// statusFromInvoice) are shared with the webhook handler.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Jobber signals rate limiting either as HTTP 429 or a GraphQL error with
// extensions.code === 'THROTTLED' (HTTP 200). Detect both.
function isThrottled(res) {
  if (res?.status === 429) return true
  const errs = res?.errors || []
  return errs.some((e) => {
    const code = e?.extensions?.code
    return code === 'THROTTLED' || /throttl/i.test(String(e?.message || ''))
  })
}

// Call once; on throttle, back off and retry with exponential waits. Jobber's
// limit is cost-based, so on THROTTLED we wait generously before retrying.
async function callWithRetry(query, variables = {}, { retries = 5, baseDelayMs = 5000 } = {}) {
  let attempt = 0
  for (;;) {
    const res = await jobberGraphQLRaw(query, variables)
    if (!isThrottled(res) || attempt >= retries) return res
    await sleep(baseDelayMs * 2 ** attempt) // 5s, 10s, 20s, 40s, 80s
    attempt += 1
  }
}

// ===========================================================================
// Sync invoices into income_report
// ===========================================================================

const PAGE_SIZE = 20 // Small pages keep per-call query cost low (Jobber throttles on cost).
const INTER_PAGE_DELAY_MS = 2000 // gentle spacing on top of throttle backoff.

// Paginated pull of every invoice with just the fields income_report needs.
const INVOICE_SYNC_QUERY = `
  query InvoiceSync($first: Int!, $after: String) {
    invoices(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        invoiceNumber
        createdAt
        invoiceStatus
        client { name }
        amounts { total }
        jobs { nodes { request { createdAt } } }
        lineItems(first: 10) {
          nodes { originalCost quantity }
        }
      }
    }
  }
`

// Shared mapping helpers — also used by the webhook handler.

// ISO timestamp -> date-only "YYYY-MM-DD" (null-safe).
export function dateOnly(ts) {
  return ts ? String(ts).slice(0, 10) : null
}

// Σ (originalCost × quantity) across line items; null cost (and null quantity)
// count as 0.
export function sumParts(lineItemNodes) {
  let parts = 0
  for (const li of lineItemNodes || []) {
    const cost = li?.originalCost == null ? 0 : Number(li.originalCost) || 0
    const qty = li?.quantity == null ? 0 : Number(li.quantity) || 0
    parts += cost * qty
  }
  return parts
}

// Status for a row that HAS an invoice: "paid" -> closed, any other (non-paid)
// invoice status -> unpaid (case-insensitive). "upcoming" is never returned
// here — it's set only for a request that has no invoice yet (REQUEST_CREATE).
export function statusFromInvoice(invoiceStatus) {
  return String(invoiceStatus || '').toLowerCase() === 'paid' ? 'closed' : 'unpaid'
}

// Map one Jobber Invoice node to an income_report row.
//
// Notes:
//   report_date = the first job's request.createdAt (date only); falls back to
//            the invoice's own createdAt when there's no job/request, so the row
//            always has a date.
//   technician_name and gross_profit are intentionally NOT set here:
//     - technician_name: omitted so re-syncs preserve any value set by the
//       webhook / manually (null on first insert, untouched on update).
//     - gross_profit: generated column.
function mapInvoiceToRow(inv) {
  const requestCreatedAt = inv?.jobs?.nodes?.[0]?.request?.createdAt || null

  return {
    jobber_id: String(inv.invoiceNumber),
    customer_name: inv?.client?.name ?? null,
    report_date: dateOnly(requestCreatedAt || inv?.createdAt),
    sale_amount: inv?.amounts?.total ?? null,
    parts: sumParts(inv?.lineItems?.nodes),
    status: statusFromInvoice(inv?.invoiceStatus),
  }
}

// Pulls invoices page by page (sequential, with throttle backoff) and upserts
// each page into income_report keyed on jobber_id. Idempotent: re-running
// updates existing rows instead of duplicating.
//
// Options:
//   maxPages  cap the number of pages this call processes (default: all).
//   after     start from a cursor (resume a previous run).
// Returns { upserted, skipped, pages, hasNextPage, nextCursor }.
export async function syncInvoices({ maxPages = Infinity, after = null } = {}) {
  const db = serviceSupabase()
  let cursor = after
  let pages = 0
  let upserted = 0
  let skipped = 0
  let hasNextPage = false

  for (;;) {
    const res = await callWithRetry(INVOICE_SYNC_QUERY, { first: PAGE_SIZE, after: cursor })
    if (!res.ok) {
      throw new Error(
        `jobber: invoice page fetch failed (status ${res.status}): ${JSON.stringify(res.errors)}`
      )
    }

    const conn = res.data?.invoices
    const nodes = Array.isArray(conn?.nodes) ? conn.nodes : []

    const rows = []
    for (const inv of nodes) {
      // jobber_id is the upsert key — skip anything without an invoiceNumber.
      if (inv?.invoiceNumber == null || String(inv.invoiceNumber).length === 0) {
        skipped += 1
        continue
      }
      rows.push(mapInvoiceToRow(inv))
    }

    if (rows.length) {
      const { error } = await db
        .from('income_report')
        .upsert(rows, { onConflict: 'jobber_id' })
      if (error) {
        throw new Error(`income_report upsert failed: ${error.message}`)
      }
      upserted += rows.length
    }

    pages += 1
    hasNextPage = Boolean(conn?.pageInfo?.hasNextPage)
    cursor = conn?.pageInfo?.endCursor || null

    if (!hasNextPage || pages >= maxPages) break
    await sleep(INTER_PAGE_DELAY_MS)
  }

  return {
    upserted,
    skipped,
    pages,
    hasNextPage,
    nextCursor: hasNextPage ? cursor : null,
  }
}
