import { previewInvoices } from '@/lib/jobber-invoices'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Headroom for the sequential calls + throttle backoff (waits up to ~1.5s+3s).
export const maxDuration = 30

// TEMPORARY introspection route — STEP 1 of the income_report reader.
// Two sequential Jobber calls: the ProductsAndServicesCategory enum, and a small
// invoices(first: 5) pull with line items + costs. Returns the raw responses so
// we can settle the parts-vs-labor mapping. Writes nothing. Never returns token
// data. Delete once mapping is settled.

export async function GET(request) {
  const params = request.nextUrl.searchParams

  // Shared-secret gate. Temporary route, so this is intentionally minimal:
  // require ?key= to match PREVIEW_SECRET. Deny if the env isn't set.
  const secret = process.env.PREVIEW_SECRET
  if (!secret || params.get('key') !== secret) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const result = await previewInvoices()

    // Compact server-side summary only (no token data, no full dump).
    console.log(
      JSON.stringify({
        evt: 'jobber.invoices_preview',
        enum_ok: result.enumValues?.ok ?? false,
        invoices_ok: result.invoices?.ok ?? false,
        invoices_errors: result.invoices?.errors?.map((e) => e.message) ?? null,
        joblink_ok: result.jobLink?.ok ?? false,
        joblink_errors: result.jobLink?.errors?.map((e) => e.message) ?? null,
        webhook_topic_count: result.webhookTopics?.topics?.length ?? null,
        request_field_count: result.requestFields?.fields?.length ?? null,
        user_name_kind: result.userName?.nameTypeKind ?? null,
        assessment_field_count: result.teamFields?.assessment?.fields?.length ?? null,
        job_field_count: result.teamFields?.job?.fields?.length ?? null,
      })
    )

    return Response.json(result)
  } catch (err) {
    // Most likely "not connected" from getValidAccessToken, or a network issue.
    console.error(JSON.stringify({ evt: 'jobber.invoices_preview_failed', err: err?.message }))
    return Response.json({ error: err?.message || 'preview_failed' }, { status: 500 })
  }
}
