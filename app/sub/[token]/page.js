import { serviceSupabase } from '@/lib/jobber'
import SubForm from './SubForm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Private per-sub links — keep them out of search results.
export const metadata = { title: 'Submit Job', robots: { index: false, follow: false } }

const wrap = {
  minHeight: '100vh',
  background: '#f4f5f7',
  display: 'flex',
  justifyContent: 'center',
  padding: '24px 16px',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  color: '#11141a',
}
const card = {
  width: '100%',
  maxWidth: '440px',
  background: '#fff',
  borderRadius: '16px',
  border: '1px solid #e4e7eb',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(17,20,26,0.06)',
  alignSelf: 'flex-start',
}

export default async function SubPage({ params }) {
  const { token } = await params
  const db = serviceSupabase()

  const { data: sub } = await db
    .from('subs')
    .select('name, jobber_user_id')
    .eq('token', token)
    .maybeSingle()

  // No match → just the invalid-link message, nothing else.
  if (!sub?.jobber_user_id) {
    return (
      <div style={wrap}>
        <div style={{ ...card, textAlign: 'center' }}>
          <div style={{ fontSize: '17px', fontWeight: 600 }}>Invalid link</div>
        </div>
      </div>
    )
  }

  // This sub's open leads: assigned to them, still upcoming, not yet priced.
  const { data: leads } = await db
    .from('income_report')
    .select('id, customer_name, report_date')
    .contains('assigned_user_ids', [sub.jobber_user_id])
    .eq('status', 'upcoming')
    .is('sale_amount', null)
    .order('report_date', { ascending: false })

  return (
    <div style={wrap}>
      <div style={card}>
        <SubForm token={token} subName={sub.name || 'Subcontractor'} leads={leads || []} />
      </div>
    </div>
  )
}
