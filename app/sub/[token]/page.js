import { serviceSupabase } from '@/lib/jobber'
import SubForm from './SubForm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Private per-sub links — keep them out of search results.
export const metadata = { title: 'Submit Job', robots: { index: false, follow: false } }

// Class-based so a media query can strip the card on phones (inline styles
// can't carry one). Desktop keeps the white card; on mobile the content sits
// flush on the page background.
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@600;700&display=swap');
  .sub-wrap {
    min-height: 100vh;
    background: #fff;
    display: flex;
    justify-content: center;
    padding: 24px 16px;
    font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #11141a;
  }
  .sub-heading {
    font-family: 'Inter Tight', 'Inter', system-ui, sans-serif;
    letter-spacing: -0.02em;
  }
  .sub-card {
    width: 100%;
    max-width: 440px;
    align-self: flex-start;
    background: #fff;
    border: 1px solid #e4e7eb;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(17, 20, 26, 0.06);
  }
  @media (max-width: 640px) {
    .sub-card {
      background: transparent;
      border: none;
      border-radius: 0;
      box-shadow: none;
      padding: 0;
    }
  }
  /* No spinner arrows on the numeric inputs. */
  .sub-wrap input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
  .sub-wrap input[type='number']::-webkit-outer-spin-button,
  .sub-wrap input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

function Shell({ children, center }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="sub-wrap">
        <div className="sub-card" style={center ? { textAlign: 'center' } : undefined}>
          {children}
        </div>
      </div>
    </>
  )
}

export default async function SubPage({ params }) {
  const { token } = await params
  const db = serviceSupabase()

  const { data: sub } = await db
    .from('subs')
    .select('jobber_user_id')
    .eq('token', token)
    .maybeSingle()

  // No match → just the invalid-link message, nothing else.
  if (!sub?.jobber_user_id) {
    return (
      <Shell center>
        <div style={{ fontSize: '17px', fontWeight: 600 }}>Invalid link</div>
      </Shell>
    )
  }

  // This sub's open leads: assigned to them and still in an open stage
  // (upcoming or open_job). Closed jobs never appear.
  const { data: leads } = await db
    .from('income_report')
    .select('id, customer_name, report_date, job_stage')
    .contains('assigned_user_ids', [sub.jobber_user_id])
    .in('job_stage', ['upcoming', 'open_job'])
    .order('report_date', { ascending: false })

  return (
    <Shell>
      <SubForm token={token} leads={leads || []} />
    </Shell>
  )
}
