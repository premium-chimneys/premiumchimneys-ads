import { jobberGraphQLRaw } from './jobber'

// Jobber invoice introspection — STEP 1 of the income_report reader.
//
// This module does NOT map or persist anything. It exists only to reveal the
// real shape of Jobber Invoices and their line items (so we can tell parts from
// labor) before writing any mapping. All three queries return the raw
// { ok, status, data, errors } from jobberGraphQLRaw — no token data.

// (1) Schema introspection. Always succeeds regardless of our field guesses
//     (an unknown __type name just returns null), so this is the source of
//     truth for exact field names on Invoice / line items / amounts / filter.
const INVOICE_SHAPE_INTROSPECTION = `
  query InvoiceShape {
    invoice: __type(name: "Invoice") {
      name
      fields { name type { kind name ofType { kind name ofType { kind name ofType { kind name } } } } }
    }
    lineItem: __type(name: "InvoiceLineItem") {
      name
      fields { name type { kind name ofType { kind name ofType { kind name } } } }
    }
    amounts: __type(name: "InvoiceAmounts") {
      name
      fields { name type { kind name ofType { kind name } } }
    }
    invoiceFilter: __type(name: "InvoiceFilterAttributes") {
      name
      inputFields { name type { kind name ofType { kind name ofType { kind name } } } }
    }
    invoiceSort: __type(name: "InvoiceSortInput") {
      name
      inputFields { name }
      enumValues { name }
    }
  }
`

// (2) Minimal high-confidence data query — no filter, just the first handful of
//     invoices with their client and line items. Field set is deliberately
//     conservative so this reliably returns REAL data to inspect even if the
//     richer query below trips on a guessed field name.
const INVOICE_SAMPLE_QUERY = `
  query InvoiceSample {
    invoices(first: 10) {
      totalCount
      nodes {
        id
        invoiceNumber
        client { id name }
        lineItems(first: 30) {
          nodes { id name description quantity }
        }
      }
    }
  }
`

// (3) Richer speculative query: adds a date-range filter, money amounts, dates,
//     and per-line cost fields. These names are best-guesses for the 2025-01-20
//     schema; if any is wrong the whole query errors (returned in `errors`) and
//     introspection (1) tells us the correct names. `from`/`to` are inlined as
//     pre-validated YYYY-MM-DD literals (the route validates them).
function buildRangeQuery(from, to) {
  return `
    query InvoiceRange {
      invoices(first: 50, filter: { issuedDate: { after: "${from}", before: "${to}" } }) {
        totalCount
        nodes {
          id
          invoiceNumber
          subject
          createdAt
          issuedDate
          invoiceStatus
          client { id name }
          amounts { subtotal discountAmount taxAmount total }
          lineItems(first: 30) {
            nodes { id name description quantity unitPrice totalPrice category }
          }
        }
      }
    }
  `
}

// Runs all three queries and returns their raw results side by side. Introspection
// and the minimal sample are independent of the date range; the ranged attempt
// uses from/to.
export async function previewInvoices({ from, to }) {
  const [introspection, sample, rangedAttempt] = await Promise.all([
    jobberGraphQLRaw(INVOICE_SHAPE_INTROSPECTION),
    jobberGraphQLRaw(INVOICE_SAMPLE_QUERY),
    jobberGraphQLRaw(buildRangeQuery(from, to)),
  ])

  return {
    range: { from, to },
    notes:
      'STEP 1 introspection only — nothing written to Supabase. `introspection` is ' +
      'authoritative for field names; `sample` is a minimal guaranteed-valid data ' +
      'pull; `rangedAttempt` is speculative (may contain GraphQL errors if a guessed ' +
      'field/filter name is wrong).',
    introspection,
    sample,
    rangedAttempt,
  }
}
