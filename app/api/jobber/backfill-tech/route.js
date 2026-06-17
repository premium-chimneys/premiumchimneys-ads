import { backfillTechnicians } from '@/lib/jobber-backfill-tech'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Early-exit keeps this short, but give headroom for throttle backoff. Use
// ?pages / ?after to run in resumable chunks if ever needed.
export const maxDuration = 300

// One-off backfill of technician_name on invoiced income_report rows that are
// null. Gated with the same PREVIEW_SECRET ?key= as the sync route. Idempotent —
// safe to re-run, and never overwrites a non-null technician.
//
// Optional query params for chunked / resumable runs:
//   ?pages=N    process at most N pages this call
//   ?after=CUR  resume from a cursor (nextCursor from a prior call)
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
    const result = await backfillTechnicians({ maxPages, after })

    console.log(JSON.stringify({ evt: 'jobber.backfill_tech', ...result }))

    return Response.json({ ok: true, ...result })
  } catch (err) {
    console.error(JSON.stringify({ evt: 'jobber.backfill_tech_failed', err: err?.message }))
    return Response.json({ ok: false, error: err?.message || 'backfill_failed' }, { status: 500 })
  }
}
