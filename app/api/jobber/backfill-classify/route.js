import { backfillClassification } from '@/lib/jobber-backfill-classify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// The Pass B walk can be long; give headroom for throttle backoff. Use
// ?pages / ?after to run it in resumable chunks.
export const maxDuration = 300

// One-off backfill of report_type + assigned_user_ids on income_report rows
// where report_type is null. Gated with the same PREVIEW_SECRET ?key= as sync.
// Idempotent — safe to re-run, never reclassifies a set row.
//
// Optional query params (apply to the Pass B invoice walk):
//   ?pages=N    process at most N pages this call
//   ?after=CUR  resume from a cursor (byWalk.nextCursor from a prior call)
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
    const result = await backfillClassification({ maxPages, after })
    console.log(JSON.stringify({ evt: 'jobber.backfill_classify', ...result }))
    return Response.json({ ok: true, ...result })
  } catch (err) {
    console.error(JSON.stringify({ evt: 'jobber.backfill_classify_failed', err: err?.message }))
    return Response.json({ ok: false, error: err?.message || 'backfill_failed' }, { status: 500 })
  }
}
