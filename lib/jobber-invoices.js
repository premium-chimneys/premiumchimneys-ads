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

// Parse Jobber's cost telemetry from a raw response. Jobber returns it under
// extensions.cost:
//   { requestedQueryCost, actualQueryCost,
//     throttleStatus: { maximumAvailable, currentlyAvailable, restoreRate } }
// where restoreRate is points/sec. Returns null when absent (older shape /
// transport error) so callers can fall back to a fixed schedule.
function parseThrottle(res) {
  const cost = res?.extensions?.cost
  const ts = cost?.throttleStatus
  if (!cost || !ts) return null
  return {
    // Cost of the query just attempted — the points we need available to run it.
    queryCost: Number(cost.requestedQueryCost ?? cost.actualQueryCost) || 0,
    currentlyAvailable: Number(ts.currentlyAvailable) || 0,
    maximumAvailable: Number(ts.maximumAvailable) || 0,
    restoreRate: Number(ts.restoreRate) || 0, // points restored per second
  }
}

// ms to wait for the bucket to hold `cost` points given telemetry `t`. Returns
// null when we can't compute it (no/zero restoreRate). +buffer so we clear the
// threshold instead of landing exactly on it.
function restoreWaitMs(t, cost, bufferMs = 750) {
  if (!t || !t.restoreRate) return null
  const deficit = cost - t.currentlyAvailable
  if (deficit <= 0) return 0
  return Math.ceil((deficit / t.restoreRate) * 1000) + bufferMs
}

// Last cost telemetry seen, with the wall-clock time it was observed. Module-
// scoped so it survives across page calls in a warm process; refined after
// every response. Lets us proactively wait before a query when the bucket is
// already known to be too low to afford it.
let lastThrottle = null
let lastThrottleAt = 0

function recordThrottle(t) {
  if (!t) return
  lastThrottle = t
  lastThrottleAt = Date.now()
}

// Estimate currently-available points now, extrapolating restore since the last
// observation (capped at the bucket max). Null when we've never seen telemetry.
function estimateAvailable() {
  if (!lastThrottle) return null
  const elapsedSec = Math.max(0, (Date.now() - lastThrottleAt) / 1000)
  const restored = lastThrottle.restoreRate * elapsedSec
  return Math.min(lastThrottle.maximumAvailable, lastThrottle.currentlyAvailable + restored)
}

// Run a query, waiting on Jobber's real cost telemetry rather than a fixed
// schedule:
//   - Proactive: before spending a request, if the estimated bucket is below the
//     expected query cost, sleep until it should have refilled — avoids tripping
//     the limit at all.
//   - Reactive: on a THROTTLED response, sleep exactly (queryCost − available) /
//     restoreRate (+buffer) and retry.
// Falls back to the old exponential schedule only when telemetry is unavailable.
// Every wait is clamped to maxWaitMs, and retries are capped.
export async function callWithRetry(
  query,
  variables = {},
  { retries = 6, fallbackBaseMs = 5000, maxWaitMs = 120_000 } = {}
) {
  // Proactive pre-wait based on the last query's cost as the estimate for this
  // one (same query shape in a loop). Skipped on the first-ever call.
  if (lastThrottle?.queryCost && lastThrottle.restoreRate) {
    const avail = estimateAvailable()
    if (avail != null && avail < lastThrottle.queryCost) {
      const waitMs = Math.min(
        maxWaitMs,
        Math.ceil(((lastThrottle.queryCost - avail) / lastThrottle.restoreRate) * 1000) + 750
      )
      if (waitMs > 0) await sleep(waitMs)
    }
  }

  let attempt = 0
  for (;;) {
    const res = await jobberGraphQLRaw(query, variables)
    const t = parseThrottle(res)
    if (t) recordThrottle(t) // read telemetry on every response

    if (!isThrottled(res) || attempt >= retries) return res

    // Reactive wait: telemetry-driven when available, else exponential fallback.
    let waitMs = restoreWaitMs(t, t?.queryCost ?? 0)
    if (waitMs == null) waitMs = fallbackBaseMs * 2 ** attempt
    await sleep(Math.min(maxWaitMs, waitMs))
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
        salesperson { name { full } }
        jobs {
          nodes {
            request {
              id
              createdAt
              assessment { assignedUsers(first: 10) { nodes { id name { full } } } }
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

// Payment for a row that HAS an invoice: Jobber "paid" -> 'paid', any other
// status -> 'unpaid' (case-insensitive). Feeds the `payment` column; the caller
// sets job_stage='closed' alongside it (an invoiced row is a finished job).
export function statusFromInvoice(invoiceStatus) {
  return String(invoiceStatus || '').toLowerCase() === 'paid' ? 'paid' : 'unpaid'
}

// One Jobber user's display name: a { full } object, or defensively a bare
// string. Null when absent.
function userFullName(user) {
  const n = user?.name
  if (!n) return null
  return typeof n === 'string' ? n : n.full ?? null
}

// The assigned team member(s) on the request's assessment. Joins multiple
// assignees with ", "; returns null when there's no assessment or no assigned
// users.
export function assignedTechnician(request) {
  const nodes = request?.assessment?.assignedUsers?.nodes
  if (!Array.isArray(nodes) || nodes.length === 0) return null
  const names = nodes.map(userFullName).filter(Boolean)
  return names.length ? names.join(', ') : null
}

// Shared technician resolver — used by sync, webhook, and backfill so all three
// behave identically:
//   ① request → assessment → assignedUsers (the normal path), then
//   ② fall back to the invoice's Salesperson when ① is null. Jobs that
//      originate from a Quote have no Request in the chain, so ① is null even
//      though Jobber still carries a person as the invoice salesperson.
export function resolveTechnician(request, salesperson) {
  return assignedTechnician(request) ?? userFullName(salesperson)
}

// ---------------------------------------------------------------------------
// Internal / external classification (IIR vs EIR)
// ---------------------------------------------------------------------------

// Jobber user IDs treated as INTERNAL (employees). Anyone else assigned to the
// request's assessment is a subcontractor. Update this set if the team changes.
const INTERNAL_USER_IDS = new Set([
  'Z2lkOi8vSm9iYmVyL1VzZXIvMjY1Mzc2NQ==', // Arin
  'Z2lkOi8vSm9iYmVyL1VzZXIvMjY1MzgyMw==', // Idan
  'Z2lkOi8vSm9iYmVyL1VzZXIvMjc1NDcwNg==', // Lior
])

// Assessment-assigned Jobber user IDs on a request — the routing signal. Empty
// array when there's no assessment or no assigned users.
export function assignedUserIds(request) {
  const nodes = request?.assessment?.assignedUsers?.nodes
  return Array.isArray(nodes) ? nodes.map((u) => u?.id).filter(Boolean) : []
}

// report_type from assigned user IDs:
//   external — there are assignee(s) and NONE are internal (a subcontractor job).
//   internal — any assignee is internal, OR there's no assignee at all (the
//              no-assignee fallback lives in IIR by request).
export function classifyReportType(userIds) {
  const ids = userIds || []
  if (ids.length === 0) return 'internal'
  return ids.some((id) => INTERNAL_USER_IDS.has(id)) ? 'internal' : 'external'
}

// Map one Jobber Invoice node to an income_report row.
//
// Notes:
//   report_date = the first job's request.createdAt (date only); falls back to
//            the invoice's own createdAt when there's no job/request, so the row
//            always has a date.
//   technician_name = resolveTechnician (request assessment, else invoice
//            salesperson), but the key is included ONLY when a tech was
//            resolved. A null tech omits the key so
//            the upsert can't overwrite an existing (webhook/manual) value — see
//            the grouped upsert in syncInvoices, which keeps tech-bearing and
//            tech-less rows in separate batches to avoid PostgREST nulling the
//            column on rows that don't carry it.
//   gross_profit is a generated column and is never set here.
function mapInvoiceToRow(inv) {
  const request = inv?.jobs?.nodes?.[0]?.request || null
  const technician = resolveTechnician(request, inv?.salesperson)
  const userIds = assignedUserIds(request)

  const row = {
    jobber_id: String(inv.invoiceNumber),
    customer_name: inv?.client?.name ?? null,
    report_date: dateOnly(request?.createdAt || inv?.createdAt),
    sale_amount: inv?.amounts?.total ?? null,
    parts: sumParts(inv?.lineItems?.nodes),
    // Invoiced rows are finished jobs: stage closed, payment from the invoice.
    job_stage: 'closed',
    payment: statusFromInvoice(inv?.invoiceStatus),
    // Always set (unlike technician_name) — uniform column, safe in the grouped
    // upsert. assigned_user_ids is stored so reclassification can be pure-SQL.
    assigned_user_ids: userIds,
    report_type: classifyReportType(userIds),
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
