import { jobberGraphQLRaw, serviceSupabase } from './jobber'

// Jobber invoice introspection — STEP 1 of the income_report reader.
//
// Does NOT map or persist anything. Two calls only, run SEQUENTIALLY with a
// short delay + throttle-aware backoff to stay under Jobber's rate limit:
//   (1) the ProductsAndServicesCategory enum (parts vs labor/service classifier)
//   (2) a small invoices(first: 5) pull with line items and costs
// Both return the raw { ok, status, data, errors } from jobberGraphQLRaw — no
// token data.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// (1) Enum values for the line-item category. Introspection never errors on a
//     wrong name (returns null), so this is safe.
const CATEGORY_ENUM_QUERY = `
  query CategoryEnum {
    __type(name: "ProductsAndServicesCategory") {
      name
      kind
      enumValues { name description }
    }
  }
`

// (2) A handful of real invoices with their line items and per-line costs.
//     `first: 20` on lineItems guards against the connection requiring a
//     pagination arg; the shape is unchanged.
const INVOICES_QUERY = `
  query InvoiceLineItems {
    invoices(first: 5) {
      nodes {
        id
        invoiceNumber
        issuedDate
        invoiceStatus
        client { name }
        amounts { subtotal total }
        lineItems(first: 20) {
          nodes {
            name
            category
            quantity
            unitPrice
            totalPrice
            originalCost
            linkedProductOrService { name }
          }
        }
      }
    }
  }
`

// (3) Job/request linkage for just the first 3 invoices — alongside the
//     existing fields — to see how an invoice ties back to a Jobber Request
//     (for a future request-id mapping). Kept to 3 to avoid throttling.
const INVOICE_JOBLINK_QUERY = `
  query InvoiceJobLink {
    invoices(first: 3) {
      nodes {
        id
        invoiceNumber
        issuedDate
        invoiceStatus
        client { name }
        amounts { subtotal total }
        lineItems(first: 10) {
          nodes { name category quantity unitPrice totalPrice originalCost linkedProductOrService { name } }
        }
        jobs { nodes { id request { id createdAt } } }
      }
    }
  }
`

// (4) Webhook topics — introspect the WebHookTopicEnum and return its values.
//     Single introspection call.
const WEBHOOK_TOPICS_QUERY = `
  query WebhookTopics {
    __type(name: "WebHookTopicEnum") {
      name
      kind
      enumValues { name description }
    }
  }
`

// Returns { ok, status, name, topics: [string], enumValues: [{name, description}] }.
// On a transport/GraphQL error, returns the raw { ok, status, errors } instead.
async function fetchWebhookTopics() {
  const res = await callWithRetry(WEBHOOK_TOPICS_QUERY)
  if (!res.ok) return res

  const t = res.data?.__type
  return {
    ok: res.ok,
    status: res.status,
    name: t?.name ?? null,
    topics: Array.isArray(t?.enumValues) ? t.enumValues.map((v) => v.name) : null,
    enumValues: t?.enumValues ?? null,
  }
}

// (5) Request type fields — to find how an assignee / assigned team member is
//     exposed on a Request (e.g. assignedUsers / assignees -> User). Single
//     light introspection call.
const REQUEST_FIELDS_QUERY = `
  query RequestFields {
    __type(name: "Request") {
      name
      fields {
        name
        type { kind name ofType { kind name ofType { kind name ofType { kind name } } } }
      }
    }
  }
`

// Returns { ok, status, name, fields: [{ name, type }] }, or the raw error result.
async function fetchRequestFields() {
  const res = await callWithRetry(REQUEST_FIELDS_QUERY)
  if (!res.ok) return res

  const t = res.data?.__type
  return {
    ok: res.ok,
    status: res.status,
    name: t?.name ?? null,
    fields: Array.isArray(t?.fields)
      ? t.fields.map((f) => ({ name: f.name, type: f.type }))
      : null,
  }
}

// (6) Shape of User.name — is it a scalar String, or an object with full/first/
//     last? Introspect User to find the name field's type, and probe likely
//     name-object type names so we get the subfields in one call. Single light
//     introspection.
const USER_NAME_QUERY = `
  query UserNameShape {
    user: __type(name: "User") {
      fields {
        name
        type { kind name ofType { kind name ofType { kind name } } }
      }
    }
    cName: __type(name: "Name") { name kind fields { name type { kind name } } }
    cPersonName: __type(name: "PersonName") { name kind fields { name type { kind name } } }
    cUserName: __type(name: "UserName") { name kind fields { name type { kind name } } }
    cFullName: __type(name: "FullName") { name kind fields { name type { kind name } } }
    cNameObject: __type(name: "NameObject") { name kind fields { name type { kind name } } }
    cContactName: __type(name: "ContactName") { name kind fields { name type { kind name } } }
    cHumanName: __type(name: "HumanName") { name kind fields { name type { kind name } } }
  }
`

const USER_NAME_CANDIDATES = [
  'cName',
  'cPersonName',
  'cUserName',
  'cFullName',
  'cNameObject',
  'cContactName',
  'cHumanName',
]

// Unwrap NON_NULL / LIST wrappers down to the underlying named type.
function unwrapType(t) {
  let cur = t
  while (cur && (cur.kind === 'NON_NULL' || cur.kind === 'LIST') && cur.ofType) {
    cur = cur.ofType
  }
  return cur || null
}

async function fetchUserName() {
  const res = await callWithRetry(USER_NAME_QUERY)
  if (!res.ok) return res

  const data = res.data || {}
  const nameField = (data.user?.fields || []).find((f) => f.name === 'name') || null
  const nameType = nameField ? unwrapType(nameField.type) : null

  const resolvedCandidates = {}
  for (const key of USER_NAME_CANDIDATES) {
    const t = data[key]
    if (t && Array.isArray(t.fields)) {
      resolvedCandidates[t.name] = t.fields.map((f) => f.name)
    }
  }

  const objectTypeName = nameType?.kind === 'OBJECT' ? nameType.name : null
  const subfields = objectTypeName ? resolvedCandidates[objectTypeName] ?? null : null

  return {
    ok: res.ok,
    status: res.status,
    isScalar: nameType?.kind === 'SCALAR',
    nameTypeKind: nameType?.kind ?? null,
    nameTypeName: nameType?.name ?? null,
    objectTypeName,
    subfields, // null if name is scalar OR the object type wasn't among the probes
    resolvedCandidates,
  }
}

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

export async function previewInvoices() {
  const enumValues = await callWithRetry(CATEGORY_ENUM_QUERY)
  // Short gap between the two calls to ease off Jobber's rate limiter.
  await sleep(1500)
  const invoices = await callWithRetry(INVOICES_QUERY)
  // Short gap before the third call to stay under the rate limiter.
  await sleep(1500)
  const jobLink = await callWithRetry(INVOICE_JOBLINK_QUERY)
  await sleep(1500)
  const webhookTopics = await fetchWebhookTopics()
  await sleep(1500)
  const requestFields = await fetchRequestFields()
  await sleep(1500)
  const userName = await fetchUserName()

  return { enumValues, invoices, jobLink, webhookTopics, requestFields, userName }
}

// ===========================================================================
// STEP 2 — sync invoices into income_report
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

// Map one Jobber Invoice node to an income_report row.
//
// Notes:
//   report_date = the first job's request.createdAt (date only); falls back to
//            the invoice's own createdAt when there's no job/request, so the row
//            always has a date.
//   parts  = Σ (originalCost × quantity); null cost counts as 0. (A null
//            quantity also contributes 0 — Jobber line items virtually always
//            carry a quantity, so this only guards against bad data.)
//   status = "paid" -> closed, anything else -> upcoming (case-insensitive).
//   technician_name and gross_profit are intentionally NOT set here:
//     - technician_name: omitted so re-syncs preserve any manual assignment
//       (null on first insert, untouched on update).
//     - gross_profit: generated column.
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

// invoiceStatus "paid" -> closed, anything else -> upcoming (case-insensitive).
export function statusFromInvoice(invoiceStatus) {
  return String(invoiceStatus || '').toLowerCase() === 'paid' ? 'closed' : 'upcoming'
}

function mapInvoiceToRow(inv) {
  // First job's request.createdAt, falling back to the invoice's createdAt.
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
