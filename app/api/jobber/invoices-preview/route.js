import { previewInvoices } from '@/lib/jobber-invoices'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// TEMPORARY introspection route — STEP 1 of the income_report reader.
// Returns the raw Jobber response(s) so we can see the real invoice / line-item
// shape (parts vs labor) before mapping. Writes nothing to Supabase. Never
// returns token data. Delete once the mapping is settled.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function ymd(date) {
  return date.toISOString().slice(0, 10)
}

export async function GET(request) {
  const params = request.nextUrl.searchParams

  // Shared-secret gate. Temporary route, so this is intentionally minimal:
  // require ?key= to match PREVIEW_SECRET. Deny if the env isn't set.
  const secret = process.env.PREVIEW_SECRET
  if (!secret || params.get('key') !== secret) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  let from = params.get('from')
  let to = params.get('to')

  // Default to the last 90 days when not supplied (or malformed). The date
  // range only affects the speculative ranged query; introspection + the
  // minimal sample are range-independent.
  if (!from || !DATE_RE.test(from) || !to || !DATE_RE.test(to)) {
    const now = new Date()
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 86400000)
    from = DATE_RE.test(from || '') ? from : ymd(ninetyDaysAgo)
    to = DATE_RE.test(to || '') ? to : ymd(now)
  }

  try {
    const result = await previewInvoices({ from, to })

    // Log a compact summary server-side (no token data, no full dump).
    console.log(
      JSON.stringify({
        evt: 'jobber.invoices_preview',
        from,
        to,
        introspection_ok: result.introspection?.ok ?? false,
        sample_ok: result.sample?.ok ?? false,
        sample_count: result.sample?.data?.invoices?.totalCount ?? null,
        ranged_ok: result.rangedAttempt?.ok ?? false,
        ranged_errors: result.rangedAttempt?.errors?.map((e) => e.message) ?? null,
      })
    )

    return Response.json(result)
  } catch (err) {
    // Most likely "not connected" from getValidAccessToken, or a network issue.
    console.error(JSON.stringify({ evt: 'jobber.invoices_preview_failed', err: err?.message }))
    return Response.json({ error: err?.message || 'preview_failed' }, { status: 500 })
  }
}
