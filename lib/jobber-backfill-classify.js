import { serviceSupabase } from './jobber'
import { callWithRetry, assignedUserIds, classifyReportType } from './jobber-invoices'

// One-off, idempotent backfill of report_type + assigned_user_ids on existing
// income_report rows where report_type is null.
//
// Two disjoint passes, by what stable Jobber id the row stores:
//   A (direct)  rows WITH jobber_request_id  -> request(id:) lookup. Covers
//               request-only "upcoming" rows and webhook-origin invoiced rows.
//   B (walk)    rows WITHOUT jobber_request_id but WITH jobber_id (pure sync
//               rows store only the printed invoice number) -> walk the invoices
//               connection and match by invoiceNumber. Early-exits once every
//               candidate is seen.
//
// Safe to re-run: candidates are recomputed from the DB each call and every
// UPDATE is guarded to report_type IS NULL, so a classified row is never
// touched again. Pass A runs fully each call; Pass B is resumable via
// { maxPages, after }.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const PAGE_SIZE = 10
const INTER_PAGE_DELAY_MS = 2000
const INTER_CALL_DELAY_MS = 300
const DB_PAGE = 1000 // PostgREST default cap; page the candidate read past it.

const REQUEST_BY_ID = `
  query ReqClassify($id: EncodedId!) {
    request(id: $id) {
      id
      assessment { assignedUsers(first: 10) { nodes { id } } }
    }
  }
`

const INVOICE_WALK_QUERY = `
  query InvClassify($first: Int!, $after: String) {
    invoices(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        invoiceNumber
        jobs {
          nodes {
            request {
              assessment { assignedUsers(first: 10) { nodes { id } } }
            }
          }
        }
      }
    }
  }
`

function requestFromInvoiceNode(node) {
  return node?.jobs?.nodes?.[0]?.request || null
}

// Page a candidate read past PostgREST's 1000-row cap. `applyExtra` adds the
// per-pass predicate that splits the two passes.
async function loadCandidates(db, applyExtra) {
  const rows = []
  for (let from = 0; ; from += DB_PAGE) {
    let q = db
      .from('income_report')
      .select('id, jobber_id, jobber_request_id')
      .is('report_type', null)
      .order('id', { ascending: true })
      .range(from, from + DB_PAGE - 1)
    q = applyExtra(q)
    const { data, error } = await q
    if (error) throw new Error(`income_report candidate select failed: ${error.message}`)
    for (const r of data || []) rows.push(r)
    if (!data || data.length < DB_PAGE) break
  }
  return rows
}

// Write report_type + assigned_user_ids for one row, guarded to report_type IS
// NULL so an already-classified row is never reclassified (idempotent).
async function writeClass(db, id, userIds) {
  const { data, error } = await db
    .from('income_report')
    .update({ report_type: classifyReportType(userIds), assigned_user_ids: userIds })
    .eq('id', id)
    .is('report_type', null)
    .select('id')
  if (error) throw new Error(`income_report classify update failed (id ${id}): ${error.message}`)
  return Array.isArray(data) ? data.length : 0
}

// Pass A: rows that store a request EncodedId — direct request(id:) lookups.
async function classifyByRequest(db) {
  const rows = await loadCandidates(db, (q) => q.not('jobber_request_id', 'is', null))
  let processed = 0
  let updated = 0
  for (const row of rows) {
    const res = await callWithRetry(REQUEST_BY_ID, { id: row.jobber_request_id })
    if (!res.ok) {
      throw new Error(
        `jobber: request lookup failed (id ${row.jobber_request_id}): ${JSON.stringify(res.errors)}`
      )
    }
    processed += 1
    updated += await writeClass(db, row.id, assignedUserIds(res.data?.request))
    if (processed < rows.length) await sleep(INTER_CALL_DELAY_MS)
  }
  return { candidates: rows.length, processed, updated }
}

// Pass B: pure-sync invoiced rows (jobber_id only) — walk the invoices
// connection, match by printed invoiceNumber, early-exit when all are seen.
async function classifyByWalk(db, { maxPages, after }) {
  const rows = await loadCandidates(db, (q) =>
    q.is('jobber_request_id', null).not('jobber_id', 'is', null)
  )
  const pending = new Map(rows.map((r) => [String(r.jobber_id), r.id]))
  const candidates = pending.size

  let cursor = after
  let pages = 0
  let scanned = 0
  let updated = 0
  let hasNextPage = false

  if (candidates === 0) {
    return { candidates, scanned, updated, pages, remaining: 0, hasNextPage, nextCursor: null }
  }

  for (;;) {
    const res = await callWithRetry(INVOICE_WALK_QUERY, { first: PAGE_SIZE, after: cursor })
    if (!res.ok) {
      throw new Error(
        `jobber: classify page fetch failed (status ${res.status}): ${JSON.stringify(res.errors)}`
      )
    }

    const conn = res.data?.invoices
    const nodes = Array.isArray(conn?.nodes) ? conn.nodes : []
    for (const node of nodes) {
      scanned += 1
      const num = node?.invoiceNumber == null ? null : String(node.invoiceNumber)
      if (!num || !pending.has(num)) continue
      const id = pending.get(num)
      pending.delete(num)
      updated += await writeClass(db, id, assignedUserIds(requestFromInvoiceNode(node)))
    }

    pages += 1
    hasNextPage = Boolean(conn?.pageInfo?.hasNextPage)
    cursor = conn?.pageInfo?.endCursor || null

    if (pending.size === 0 || !hasNextPage || pages >= maxPages) break
    await sleep(INTER_PAGE_DELAY_MS)
  }

  const moreWork = hasNextPage && pending.size > 0
  return { candidates, scanned, updated, pages, remaining: pending.size, hasNextPage, nextCursor: moreWork ? cursor : null }
}

// Pass A fully (cheap, targeted) then Pass B (resumable walk). Returns both.
export async function backfillClassification({ maxPages = Infinity, after = null } = {}) {
  const db = serviceSupabase()
  const byRequest = await classifyByRequest(db)
  const byWalk = await classifyByWalk(db, { maxPages, after })
  return { byRequest, byWalk }
}
