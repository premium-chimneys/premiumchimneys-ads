import { verifyJobberSignature, processWebhookEvent } from '@/lib/jobber-webhook'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Jobber webhook receiver -> income_report. Verifies the X-Jobber-Hmac-SHA256
// signature against the raw body, then processes REQUEST_CREATE / REQUEST_UPDATE
// / INVOICE_CREATE / INVOICE_UPDATE. Returns 200 on success; 401 on bad
// signature; 500 on a processing error so Jobber retries.
export async function POST(request) {
  // Read the RAW body — HMAC must be computed over the exact bytes Jobber sent,
  // not a re-serialized JSON object.
  const raw = await request.text()
  const signature = request.headers.get('x-jobber-hmac-sha256')

  if (!verifyJobberSignature(raw, signature)) {
    console.warn(JSON.stringify({ evt: 'jobber.webhook_bad_signature' }))
    return new Response('invalid signature', { status: 401 })
  }

  let payload
  try {
    payload = JSON.parse(raw)
  } catch {
    // Signed but unparseable — ack so Jobber doesn't retry a poison payload.
    return Response.json({ ok: false, error: 'bad_json' }, { status: 200 })
  }

  const event = payload?.data?.webHookEvent
  const topic = event?.topic
  const itemId = event?.itemId
  if (!topic || !itemId) {
    return Response.json({ ok: true, action: 'ignored_no_topic' }, { status: 200 })
  }

  try {
    const result = await processWebhookEvent({ topic, itemId })
    console.log(JSON.stringify({ evt: 'jobber.webhook', topic, ...result }))
    return Response.json({ ok: true, ...result }, { status: 200 })
  } catch (err) {
    // Transient (GraphQL/DB) failure — 500 lets Jobber retry with backoff.
    console.error(JSON.stringify({ evt: 'jobber.webhook_failed', topic, err: err?.message }))
    return Response.json({ ok: false, error: err?.message || 'processing_failed' }, { status: 500 })
  }
}
