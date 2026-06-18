import { serviceSupabase } from '@/lib/jobber'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Public submission endpoint for the per-sub job page (/sub/[token]). Service-
// role only; the sub's jobber_user_id is re-derived from the token (never
// trusted from the client). Each action is a guarded stage transition — the
// update lands only when the row belongs to this sub AND is in the expected
// source job_stage, which blocks tampering and double-submit.
function nonNegNumber(v) {
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : null
}

function cleanNotes(v) {
  if (v == null) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

const ACTIONS = new Set(['same_day_close', 'open_job_create', 'open_job_close'])

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  const { token, rowId, action } = body || {}
  if (!token || rowId === undefined || rowId === null || rowId === '') {
    return Response.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }
  if (!ACTIONS.has(action)) {
    return Response.json({ ok: false, error: 'invalid_action' }, { status: 400 })
  }

  const notes = cleanNotes(body.notes)

  // Validate per-action amounts and assemble the patch + required source stage.
  let patch
  let fromStage
  if (action === 'same_day_close') {
    const total = nonNegNumber(body.total)
    const parts = nonNegNumber(body.parts)
    if (total === null || parts === null) {
      return Response.json({ ok: false, error: 'invalid_amounts' }, { status: 400 })
    }
    fromStage = 'upcoming'
    patch = { sale_amount: total, parts, notes, job_stage: 'closed', payment: 'unpaid' }
  } else if (action === 'open_job_create') {
    const total = nonNegNumber(body.total)
    const deposit = nonNegNumber(body.deposit)
    if (total === null || deposit === null) {
      return Response.json({ ok: false, error: 'invalid_amounts' }, { status: 400 })
    }
    fromStage = 'upcoming'
    patch = { sale_amount: total, deposit, notes, job_stage: 'open_job', payment: 'unpaid' }
  } else {
    // open_job_close — only parts (amount/deposit already set at create time).
    const parts = nonNegNumber(body.parts)
    if (parts === null) {
      return Response.json({ ok: false, error: 'invalid_amounts' }, { status: 400 })
    }
    fromStage = 'open_job'
    patch = { parts, job_stage: 'closed' } // notes appended below
  }

  const db = serviceSupabase()

  // Re-derive the sub from the token → trusted jobber_user_id.
  const { data: sub, error: subError } = await db
    .from('subs')
    .select('jobber_user_id')
    .eq('token', token)
    .maybeSingle()
  if (subError) return Response.json({ ok: false, error: 'lookup_failed' }, { status: 500 })
  if (!sub?.jobber_user_id) {
    return Response.json({ ok: false, error: 'invalid_token' }, { status: 403 })
  }

  // Open-job close appends to the existing note (preserve the create-stage note).
  // The UPDATE's stage guard below still makes the transition atomic.
  if (action === 'open_job_close') {
    const { data: cur, error: curErr } = await db
      .from('income_report')
      .select('notes')
      .eq('id', rowId)
      .contains('assigned_user_ids', [sub.jobber_user_id])
      .eq('job_stage', 'open_job')
      .maybeSingle()
    if (curErr) return Response.json({ ok: false, error: 'lookup_failed' }, { status: 500 })
    if (!cur) {
      return Response.json({ ok: false, error: 'stage_mismatch' }, { status: 409 })
    }
    const prev = cleanNotes(cur.notes)
    patch.notes = prev ? (notes ? `${prev}\n${notes}` : prev) : notes
  }

  // Guarded transition: id + assigned to this sub + expected source stage.
  // 0 rows = tampered id, not this sub's lead, or wrong/already-advanced stage.
  const { data: updated, error } = await db
    .from('income_report')
    .update(patch)
    .eq('id', rowId)
    .contains('assigned_user_ids', [sub.jobber_user_id])
    .eq('job_stage', fromStage)
    .select('id')
  if (error) return Response.json({ ok: false, error: 'update_failed' }, { status: 500 })
  if (!updated?.length) {
    return Response.json({ ok: false, error: 'stage_mismatch' }, { status: 409 })
  }

  return Response.json({ ok: true })
}
