import { createHmac, timingSafeEqual } from 'node:crypto'

import { jobberGraphQLRaw } from './jobber'

// Jobber webhook processing for the Reputation Manager fan-out.
//
// This file used to own the income_report table as well; that reporting feature
// (and the subcontractor pages that wrote to it) has been removed, so the only
// remaining job here is to notify the review campaign in the agents app about
// invoices. REQUEST_* topics are now acknowledged and ignored.
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

// Jobber "paid" -> 'paid', any other status -> 'unpaid' (case-insensitive).
// Previously shared with the invoice sync; inlined here now that the enroll
// fan-out is the only remaining caller.
function statusFromInvoice(invoiceStatus) {
  return String(invoiceStatus || '').toLowerCase() === 'paid' ? 'paid' : 'unpaid'
}

// ---------------------------------------------------------------------------
// Reputation Manager fan-out (best-effort, fully isolated)
// ---------------------------------------------------------------------------
// When an invoice is paid, notify the review campaign in the agents app
// (premiumchimneys-agents). Best-effort by design: its own minimal contact
// query, its own error handling, a hard timeout, and it must NEVER throw or
// change the webhook's response.
//
// The position was called Maya and is now the Reputation Manager. Both env var
// names are read and the old header is still sent alongside the new one, so this
// file and the agents app can be deployed in either order without a window where
// a paid customer is dropped. Once REPUTATION_ENROLL_URL and
// REPUTATION_REVIEW_GUARD_URL are set on this project, the MAYA_ fallbacks below
// and the duplicated header can go.

const FANOUT_TIMEOUT_MS = 5000

// New name first, old name as a fallback. Read at call time rather than at
// module load, so setting the variable takes effect on the next invocation
// instead of the next cold start.
function enrollUrl() {
  return process.env.REPUTATION_ENROLL_URL || process.env.MAYA_ENROLL_URL
}

function reviewGuardUrl() {
  return process.env.REPUTATION_REVIEW_GUARD_URL || process.env.MAYA_REVIEW_GUARD_URL
}

function enrollSecret() {
  return process.env.REPUTATION_ENROLL_SECRET || process.env.MAYA_ENROLL_SECRET
}

// Both header names, same value. The receiving routes accept either; sending
// both means this deploys safely against an agents app on either side of its own
// rename. Drop the second once that app is live.
function fanoutHeaders(secret) {
  return {
    'Content-Type': 'application/json',
    'x-reputation-enroll-secret': secret,
    'x-maya-enroll-secret': secret,
  }
}

// Minimal contact lookup — pulls only what enroll needs.
const ENROLL_INVOICE_CONTACT = `
  query InvoiceContact($id: EncodedId!) {
    invoice(id: $id) {
      id
      invoiceNumber
      invoiceStatus
      client {
        name
        phones { number primary }
        emails { address primary }
      }
    }
  }
`

// Prefer the entry flagged primary, else the first; null if none.
function firstContact(list, field) {
  if (!Array.isArray(list) || list.length === 0) return null
  const primary = list.find((x) => x?.primary)
  return (primary || list[0])?.[field] || null
}

// Logged once when the env isn't configured, so the no-op path is quiet.
let enrollEnvWarned = false

async function fanOutEnroll(itemId) {
  try {
    const url = enrollUrl()
    const secret = enrollSecret()
    if (!url || !secret) {
      if (!enrollEnvWarned) {
        console.log(
          JSON.stringify({ evt: 'reputation.fanout_disabled', reason: 'enroll URL/SECRET unset' })
        )
        enrollEnvWarned = true
      }
      return
    }

    // Non-throwing GraphQL — its own query, no retry (best-effort, must be fast).
    const res = await jobberGraphQLRaw(ENROLL_INVOICE_CONTACT, { id: itemId })
    const inv = res?.data?.invoice
    if (!res?.ok || !inv?.id) return

    if (statusFromInvoice(inv.invoiceStatus) !== 'paid') return

    const name = inv.client?.name || 'there'
    const phone = firstContact(inv.client?.phones, 'number')
    const email = firstContact(inv.client?.emails, 'address')
    const invoiceId = inv.invoiceNumber != null ? String(inv.invoiceNumber) : inv.id

    if (!phone && !email) {
      console.log(JSON.stringify({ evt: 'reputation.fanout_skipped', reason: 'no_contact', invoiceId }))
      return
    }

    // Hard timeout so a slow agents endpoint can't delay the Jobber response.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FANOUT_TIMEOUT_MS)
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: fanoutHeaders(secret),
        body: JSON.stringify({ name, phone, email, invoiceId }),
        signal: controller.signal,
      })
      console.log(JSON.stringify({ evt: 'reputation.fanout', invoiceId, status: resp.status, ok: resp.ok }))
    } finally {
      clearTimeout(timer)
    }
  } catch (err) {
    // Swallow EVERYTHING — the enroll is best-effort and must not fail the hook.
    console.error(JSON.stringify({ evt: 'reputation.fanout_failed', err: err?.message || String(err) }))
  }
}

// Review-guard fan-out (best-effort, fully isolated) — sibling of fanOutEnroll.
// On INVOICE_CREATE, tell the agents app to turn OFF Jobber's built-in
// review-request SMS for the new invoice, so there is exactly one party asking
// the customer for a review. Same isolation contract as the enroll fan-out: its
// own URL, a hard timeout, and it NEVER throws or affects the response.
//
// Shares the enroll secret rather than having its own — the two routes are the
// same trust boundary reached by the same caller, and a second secret would be a
// second thing to rotate for no additional isolation.

let reviewGuardEnvWarned = false

async function fanOutReviewGuard(itemId) {
  try {
    const url = reviewGuardUrl()
    const secret = enrollSecret()
    if (!url || !secret) {
      if (!reviewGuardEnvWarned) {
        console.log(
          JSON.stringify({ evt: 'review_guard.fanout_disabled', reason: 'review guard URL/SECRET unset' })
        )
        reviewGuardEnvWarned = true
      }
      return
    }

    // Forward just the invoice id — the guard does its own lookup and its own
    // idempotency check (it skips when the flag is already off), so there is no
    // GraphQL here to keep in step with theirs.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FANOUT_TIMEOUT_MS)
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: fanoutHeaders(secret),
        body: JSON.stringify({ invoiceId: itemId }),
        signal: controller.signal,
      })
      console.log(JSON.stringify({ evt: 'review_guard.fanout', invoiceId: itemId, status: resp.status, ok: resp.ok }))
    } finally {
      clearTimeout(timer)
    }
  } catch (err) {
    // Swallow EVERYTHING. Best-effort.
    console.error(JSON.stringify({ evt: 'review_guard.fanout_failed', err: err?.message || String(err) }))
  }
}

// Dispatch by topic. REQUEST_CREATE / REQUEST_UPDATE only ever fed
// income_report, so they now fall through to the ignored branch and are
// acknowledged without work.
export async function processWebhookEvent({ topic, itemId }) {
  switch (topic) {
    case 'INVOICE_CREATE':
      // Disable Jobber's own review SMS on the new invoice.
      await fanOutReviewGuard(itemId)
      return { action: 'review_guard_dispatched', itemId }
    case 'INVOICE_UPDATE':
      // Enrol the customer into the review campaign once the invoice is paid.
      await fanOutEnroll(itemId)
      return { action: 'enroll_dispatched', itemId }
    default:
      return { action: 'ignored', topic }
  }
}
