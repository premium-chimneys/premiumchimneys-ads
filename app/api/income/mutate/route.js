import { serviceSupabase } from '@/lib/jobber'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Admin write endpoint for the income report (delete / inline edit). The browser
// uses the public anon key, which RLS blocks from mutating income_report, so
// those writes must run here with the service-role key (which bypasses RLS).
//
// Gating: the same admin password the page logs in with. NOTE: that password
// ships in the client bundle, so this gate is cosmetic — on par with the rest of
// the admin page. Set ADMIN_PASSWORD to harden it (and update the login flow to
// match) if this ever needs real protection.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rocket99'

// Columns the client may change. gross_profit is a generated column. `payment`
// is toggled (unpaid/paid) from the EIR table.
const UPDATABLE = new Set(['technician_name', 'sale_amount', 'parts', 'payment'])

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 })
  }

  const { action, id, password, patch } = body || {}

  if (password !== ADMIN_PASSWORD) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (id === undefined || id === null || id === '') {
    return Response.json({ error: 'missing_id' }, { status: 400 })
  }

  const db = serviceSupabase()

  if (action === 'delete') {
    const { error } = await db.from('income_report').delete().eq('id', id)
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ ok: true })
  }

  if (action === 'update') {
    // Whitelist patch keys so only editable columns can be written.
    const clean = {}
    for (const k of Object.keys(patch || {})) {
      if (UPDATABLE.has(k)) clean[k] = patch[k]
    }
    if (Object.keys(clean).length === 0) {
      return Response.json({ error: 'no_updatable_fields' }, { status: 400 })
    }

    const { data, error } = await db
      .from('income_report')
      .update(clean)
      .eq('id', id)
      .select()
      .single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ ok: true, row: data })
  }

  return Response.json({ error: 'unknown_action' }, { status: 400 })
}
