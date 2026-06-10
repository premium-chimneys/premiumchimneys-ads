import { syncInvoices } from '@/lib/jobber-invoices'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// First sync walks ~2164 invoices across ~22 pages. Give it headroom; Vercel
// clamps to the plan's max if this exceeds it.
export const maxDuration = 300

// Jobber -> income_report sync. Gated with the same PREVIEW_SECRET ?key=.
// Requires a UNIQUE constraint on income_report.jobber_id (onConflict key).
//
// Optional query params for chunked / resumable runs if a single call risks the
// function timeout:
//   ?pages=N    process at most N pages this call
//   ?after=CUR  resume from a cursor returned as nextCursor by a prior call
export async function GET(request) {
  const params = request.nextUrl.searchParams

  const secret = process.env.PREVIEW_SECRET
  if (!secret || params.get('key') !== secret) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const pagesParam = Number(params.get('pages'))
  const maxPages = Number.isInteger(pagesParam) && pagesParam > 0 ? pagesParam : Infinity
  const after = params.get('after') || null

  try {
    const result = await syncInvoices({ maxPages, after })

    console.log(JSON.stringify({ evt: 'jobber.sync', ...result }))

    return Response.json({
      ok: true,
      upserted: result.upserted,
      skipped: result.skipped,
      pages: result.pages,
      hasNextPage: result.hasNextPage,
      nextCursor: result.nextCursor,
    })
  } catch (err) {
    console.error(JSON.stringify({ evt: 'jobber.sync_failed', err: err?.message }))
    return Response.json({ ok: false, error: err?.message || 'sync_failed' }, { status: 500 })
  }
}
