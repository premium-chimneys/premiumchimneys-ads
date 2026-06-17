import { serviceSupabase } from './jobber'
import { resolveTechnician, callWithRetry } from './jobber-invoices'

// One-off, idempotent backfill of technician_name on invoiced income_report rows
// that are currently null.
//
// Approach: a BOUNDED connection walk. Jobber's invoices(filter:{invoiceNumber})
// keys on the EncodedId, not the printed number we store in jobber_id, so a
// direct by-number lookup is impossible. Instead we load the (small) set of
// null-tech invoice numbers, walk the invoices connection requesting the printed
// invoiceNumber + the request -> assessment -> assignedUsers chain, match nodes
// client-side, and EARLY-EXIT as soon as every candidate has been seen — so we
// don't scan the whole account just to fill a handful of rows.
//
// Order: the default connection order (effectively recent-first, same as the
// proven INVOICE_SYNC_QUERY) — order only affects how soon we can early-exit,
// not correctness.
//
// Throttle: reuses callWithRetry from jobber-invoices, which detects body-level
// errors[].extensions.code === 'THROTTLED' (HTTP 200) and backs off
// exponentially. Early-exit keeps cumulative query cost low, so throttling is
// far less likely than the original full walk.
//
// Safe to re-run: candidates are recomputed from the DB each call, and the
// UPDATE is filtered to technician_name IS NULL, so a non-null value is never
// overwritten.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const PAGE_SIZE = 20 // reasonable page; early-exit means few pages in practice.
const INTER_PAGE_DELAY_MS = 2000
const DB_PAGE = 1000 // PostgREST default cap; page the candidate read past it.

const INVOICE_WALK_QUERY = `
  query InvoiceTechWalk($first: Int!, $after: String) {
    invoices(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        invoiceNumber
        salesperson { name { full } }
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

// Tech for an invoice node: first job's request assessment, else the invoice
// salesperson (shared resolver, same as sync/webhook).
function technicianFromInvoiceNode(node) {
  const request = node?.jobs?.nodes?.[0]?.request || null
  return resolveTechnician(request, node?.salesperson)
}

// Load every invoiced row still missing a tech, as a Set of invoice-number
// strings. Paged past PostgREST's 1000-row default so a large backlog isn't
// silently truncated.
async function loadCandidates(db) {
  const numbers = new Set()
  for (let from = 0; ; from += DB_PAGE) {
    const { data, error } = await db
      .from('income_report')
      .select('jobber_id')
      .is('technician_name', null)
      .not('jobber_id', 'is', null)
      .order('jobber_id', { ascending: true })
      .range(from, from + DB_PAGE - 1)
    if (error) throw new Error(`income_report candidate select failed: ${error.message}`)

    for (const r of data || []) numbers.add(String(r.jobber_id))
    if (!data || data.length < DB_PAGE) break
  }
  return numbers
}

// Options (mirror syncInvoices for chunked / resumable runs):
//   maxPages  cap pages this call processes (default: all)
//   after     resume from a cursor (nextCursor from a prior call)
// Returns { candidates, scanned, matched, resolved, updated, remaining, pages,
//           hasNextPage, nextCursor }.
export async function backfillTechnicians({ maxPages = Infinity, after = null } = {}) {
  const db = serviceSupabase()
  const needsTech = await loadCandidates(db)
  const candidates = needsTech.size

  let cursor = after
  let pages = 0
  let scanned = 0 // invoice nodes seen
  let matched = 0 // node's printed number was a candidate
  let resolved = 0 // a tech was found for a matched node
  let updated = 0 // rows actually written
  let hasNextPage = false

  // Nothing to do — cheap no-op so a re-run after completion is harmless.
  if (candidates === 0) {
    return { candidates, scanned, matched, resolved, updated, remaining: 0, pages, hasNextPage, nextCursor: null }
  }

  for (;;) {
    const res = await callWithRetry(INVOICE_WALK_QUERY, { first: PAGE_SIZE, after: cursor })
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
      // Drop from the pending set whether or not a tech was found — either way
      // there's nothing more to do for this invoice, and clearing it lets us
      // early-exit. A genuinely tech-less invoice just stays null.
      needsTech.delete(num)
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
    }

    pages += 1
    hasNextPage = Boolean(conn?.pageInfo?.hasNextPage)
    cursor = conn?.pageInfo?.endCursor || null

    // Stop when every candidate is seen, out of invoices, or page cap hit.
    if (needsTech.size === 0 || !hasNextPage || pages >= maxPages) break
    await sleep(INTER_PAGE_DELAY_MS)
  }

  const moreWork = hasNextPage && needsTech.size > 0
  return {
    candidates,
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
