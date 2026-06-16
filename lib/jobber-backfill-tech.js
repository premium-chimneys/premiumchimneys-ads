import { serviceSupabase } from './jobber'
import { assignedTechnician, callWithRetry } from './jobber-invoices'

// One-off, idempotent backfill of technician_name on invoiced income_report rows
// that are currently null.
//
// Why a connection walk and not per-row INVOICE_BY_ID: the rows missing a tech
// are mostly bulk-sync rows, which persist only the invoice NUMBER (jobber_id) —
// no invoice/request EncodedId — so there's nothing to pass to invoice(id:). We
// instead page the invoices connection (the same throttle-aware pagination the
// sync uses) with the identical request -> assessment -> assignedUsers chain and
// match nodes back to candidate rows by invoice number.
//
// Safe to re-run: candidates are (re)computed from the DB each call, and the
// UPDATE is filtered to technician_name IS NULL, so a non-null value is never
// overwritten even if it was set between the candidate scan and the write.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const PAGE_SIZE = 10 // match the sync: assessment selection raises query cost.
const INTER_PAGE_DELAY_MS = 2000
const DB_PAGE = 1000 // PostgREST default cap; page the candidate read.

// Lighter than the full sync query — only what's needed to key a row (invoice
// number) and resolve its tech (first job's request assessment).
const BACKFILL_QUERY = `
  query TechBackfill($first: Int!, $after: String) {
    invoices(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        invoiceNumber
        jobs {
          nodes {
            request {
              assessment { assignedUsers(first: 5) { nodes { name { full } } } }
            }
          }
        }
      }
    }
  }
`

// Tech for an invoice node = its first job's request assessment assignee(s).
function technicianFromInvoiceNode(node) {
  const request = node?.jobs?.nodes?.[0]?.request || null
  return assignedTechnician(request)
}

// Load every invoiced row still missing a tech, as a Set of invoice-number
// strings. Paged past PostgREST's 1000-row default so large backlogs aren't
// silently truncated.
async function loadCandidates(db) {
  const needsTech = new Set()
  for (let from = 0; ; from += DB_PAGE) {
    const { data, error } = await db
      .from('income_report')
      .select('jobber_id')
      .is('technician_name', null)
      .not('jobber_id', 'is', null)
      .order('jobber_id', { ascending: true })
      .range(from, from + DB_PAGE - 1)
    if (error) throw new Error(`income_report candidate select failed: ${error.message}`)

    for (const r of data || []) needsTech.add(String(r.jobber_id))
    if (!data || data.length < DB_PAGE) break
  }
  return needsTech
}

// Options mirror syncInvoices for chunked / resumable runs:
//   maxPages  cap pages this call processes (default: all)
//   after     resume from a cursor (nextCursor from a prior call)
// Returns { scanned, matched, resolved, updated, remaining, pages, hasNextPage, nextCursor }.
export async function backfillTechnicians({ maxPages = Infinity, after = null } = {}) {
  const db = serviceSupabase()
  const needsTech = await loadCandidates(db)

  let cursor = after
  let pages = 0
  let scanned = 0 // invoice nodes seen
  let matched = 0 // node's invoice number was a candidate
  let resolved = 0 // a tech was found for a matched node
  let updated = 0 // rows actually written
  let hasNextPage = false

  // Nothing to do — return early so a re-run after completion is a cheap no-op.
  if (needsTech.size === 0) {
    return { scanned, matched, resolved, updated, remaining: 0, pages, hasNextPage, nextCursor: null }
  }

  for (;;) {
    const res = await callWithRetry(BACKFILL_QUERY, { first: PAGE_SIZE, after: cursor })
    if (!res.ok) {
      throw new Error(
        `jobber: backfill page fetch failed (status ${res.status}): ${JSON.stringify(res.errors)}`
      )
    }

    const conn = res.data?.invoices
    const nodes = Array.isArray(conn?.nodes) ? conn.nodes : []

    for (const node of nodes) {
      scanned += 1
      const num = node?.invoiceNumber == null ? null : String(node.invoiceNumber)
      if (!num || !needsTech.has(num)) continue
      matched += 1

      const technician = technicianFromInvoiceNode(node)
      if (technician == null) continue
      resolved += 1

      // IS NULL guard: never overwrite a value set since the candidate scan.
      const { data: upd, error: updError } = await db
        .from('income_report')
        .update({ technician_name: technician })
        .eq('jobber_id', num)
        .is('technician_name', null)
        .select('id')
      if (updError) {
        throw new Error(`income_report tech update failed (invoice ${num}): ${updError.message}`)
      }
      updated += Array.isArray(upd) ? upd.length : 0
      needsTech.delete(num)
    }

    pages += 1
    hasNextPage = Boolean(conn?.pageInfo?.hasNextPage)
    cursor = conn?.pageInfo?.endCursor || null

    // Stop when out of invoices, hit the page cap, or every candidate is filled.
    if (!hasNextPage || pages >= maxPages || needsTech.size === 0) break
    await sleep(INTER_PAGE_DELAY_MS)
  }

  const moreWork = hasNextPage && needsTech.size > 0
  return {
    scanned,
    matched,
    resolved,
    updated,
    remaining: needsTech.size,
    pages,
    hasNextPage,
    nextCursor: moreWork ? cursor : null,
  }
}
