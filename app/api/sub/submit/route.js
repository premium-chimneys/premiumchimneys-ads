import { serviceSupabase } from '@/lib/jobber'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Public submission endpoint for the per-sub job page (/sub/[token]). The page
// is public, so the write runs here with the SERVICE-ROLE key — never the anon
// client in the browser. Two guards block tampering:
//   1. the sub's jobber_user_id is re-derived from the token server-side (the
//      client is never trusted to supply it);
//   2. the update only lands on a row that actually contains this sub's
//      jobber_user_id and is still open (sale_amount IS NULL).
function nonNegNumber(v) {
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  const { token, rowId, total, parts } = body || {}
  if (!token || rowId === undefined || rowId === null || rowId === '') {
    return Response.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }

  const totalNum = nonNegNumber(total)
  const partsNum = nonNegNumber(parts)
  if (totalNum === null || partsNum === null) {
    return Response.json({ ok: false, error: 'invalid_amounts' }, { status: 400 })
  }

  const db = serviceSupabase()

  // Resolve the sub from the token → trusted jobber_user_id.
  const { data: sub, error: subError } = await db
    .from('subs')
    .select('jobber_user_id')
    .eq('token', token)
    .maybeSingle()
  if (subError) return Response.json({ ok: false, error: 'lookup_failed' }, { status: 500 })
  if (!sub?.jobber_user_id) {
    return Response.json({ ok: false, error: 'invalid_token' }, { status: 403 })
  }

  // Guarded update — 0 rows means: tampered id, a lead not assigned to this sub,
  // or already submitted. "Still open" = status 'upcoming' AND unpriced
  // (sale_amount NULL or 0). After submit, status flips to 'unpaid', so a second
  // submit is rejected by the status guard even if the entered total was 0.
  const { data: updated, error } = await db
    .from('income_report')
    .update({ sale_amount: totalNum, parts: partsNum, status: 'unpaid' })
    .eq('id', rowId)
    .contains('assigned_user_ids', [sub.jobber_user_id])
    .eq('status', 'upcoming')
    .or('sale_amount.is.null,sale_amount.eq.0')
    .select('id')
  if (error) return Response.json({ ok: false, error: 'update_failed' }, { status: 500 })
  if (!updated?.length) {
    return Response.json({ ok: false, error: 'not_allowed_or_already_submitted' }, { status: 409 })
  }

  return Response.json({ ok: true })
}
