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
export async function callWithRetry(query, variables = {}, { retries = 5, baseDelayMs = 5000 } = {}) {
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

// 10/page (down from 20): the per-node assessment.assignedUsers selection below
// raises Jobber's cost-based query weight, so smaller pages keep each call under
// the throttle ceiling. callWithRetry's exponential backoff (5/10/20/40/80s)
// still absorbs any THROTTLED responses that slip through.
const PAGE_SIZE = 10
const INTER_PAGE_DELAY_MS = 2000 // gentle spacing on top of throttle backoff.

// Paginated pull of every invoice with just the fields income_report needs.
// The request → assessment → assignedUsers chain is what carries the assigned
// technician (invoices themselves don't), mirroring the webhook's INVOICE_BY_ID.
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
        jobs {
          nodes {
            request {
              id
              createdAt
              assessment { assignedUsers(first: 5) { nodes { name { full } } } }
            }
          }
        }
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

// The assigned team member(s) live on the request's assessment. Joins multiple
// assignees with ", "; returns null when there's no assessment or no assigned
// users. Each user's name may be an object { full } or, defensively, a string.
// Shared by the webhook handler and the backfill so the resolution logic stays
// in one place.
export function assignedTechnician(request) {
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

// Map one Jobber Invoice node to an income_report row.
//
// Notes:
//   report_date = the first job's request.createdAt (date only); falls back to
//            the invoice's own createdAt when there's no job/request, so the row
//            always has a date.
//   technician_name = the request assessment's assigned tech, but the key is
//            included ONLY when a tech was resolved. A null tech omits the key so
//            the upsert can't overwrite an existing (webhook/manual) value — see
//            the grouped upsert in syncInvoices, which keeps tech-bearing and
//            tech-less rows in separate batches to avoid PostgREST nulling the
//            column on rows that don't carry it.
//   gross_profit is a generated column and is never set here.
function mapInvoiceToRow(inv) {
  const request = inv?.jobs?.nodes?.[0]?.request || null
  const technician = assignedTechnician(request)

  const row = {
    jobber_id: String(inv.invoiceNumber),
    customer_name: inv?.client?.name ?? null,
    report_date: dateOnly(request?.createdAt || inv?.createdAt),
    sale_amount: inv?.amounts?.total ?? null,
    parts: sumParts(inv?.lineItems?.nodes),
    status: statusFromInvoice(inv?.invoiceStatus),
  }
  if (technician != null) row.technician_name = technician
  return row
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
      // Split by whether the row carries technician_name. A single bulk upsert
      // unions every object's keys and writes NULL (via ON CONFLICT ... SET) for
      // any row missing a key — which would wipe an existing tech on the rows
      // that didn't resolve one. Two homogeneous batches avoid that: the
      // tech-bearing batch always sets the column, the tech-less batch never
      // mentions it (so existing values are preserved).
      const withTech = rows.filter((r) => r.technician_name != null)
      const withoutTech = rows.filter((r) => r.technician_name == null)

      for (const batch of [withoutTech, withTech]) {
        if (!batch.length) continue
        const { error } = await db
          .from('income_report')
          .upsert(batch, { onConflict: 'jobber_id' })
        if (error) {
          throw new Error(`income_report upsert failed: ${error.message}`)
        }
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
