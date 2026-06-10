import { jobberGraphQLRaw } from './jobber'

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

// Call once; on throttle, back off and retry. Short, bounded waits so we stay
// well under the function timeout: 1.5s then 3s.
async function callWithRetry(query, { retries = 2, baseDelayMs = 1500 } = {}) {
  let attempt = 0
  for (;;) {
    const res = await jobberGraphQLRaw(query)
    if (!isThrottled(res) || attempt >= retries) return res
    await sleep(baseDelayMs * 2 ** attempt)
    attempt += 1
  }
}

export async function previewInvoices() {
  const enumValues = await callWithRetry(CATEGORY_ENUM_QUERY)
  // Short gap between the two calls to ease off Jobber's rate limiter.
  await sleep(1500)
  const invoices = await callWithRetry(INVOICES_QUERY)

  return { enumValues, invoices }
}
