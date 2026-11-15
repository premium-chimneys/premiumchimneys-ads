import { popupDb } from '@/lib/popupDb'

// Private stats for the timed popup. Not linked from anywhere, kept out of
// search engines (here and by the X-Robots-Tag header in next.config.mjs), and
// not password protected. Data comes from sql/popup_events.sql.

export const metadata = {
  title: 'Popup stats',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

const RANGES = {
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  all: { label: 'All time', days: null },
}

const KIND_LABELS = { booking: 'Booked', form: 'Sent a form', call: 'Tapped call', chat: 'Chat lead' }

const pct = (n, d) => (d ? `${Math.round((n / d) * 100)}%` : '–')

const CSS = `
.ps{min-height:100vh;background:#f6f6f8;color:#0c0f14;padding:40px 16px;
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,"Segoe UI",Roboto,sans-serif}
.ps-wrap{max-width:720px;margin:0 auto}
.ps h1{font-size:28px;font-weight:800;letter-spacing:-.02em;margin:0 0 4px}
.ps-sub{color:#6b7280;font-size:14px;margin:0 0 24px}
.ps-tabs{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}
.ps-tab{padding:8px 14px;border-radius:999px;border:1px solid #d9dbe1;font-size:14px;font-weight:600;color:#0c0f14;text-decoration:none;background:#fff}
.ps-tab[aria-current="page"]{background:#4a5df6;border-color:#4a5df6;color:#fff}
.ps-card{background:#fff;border-radius:20px;padding:24px;margin-bottom:16px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.ps-hero{display:flex;align-items:baseline;gap:10px}
.ps-big{font-size:44px;font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.ps-label{font-size:15px;color:#6b7280;font-weight:600}
.ps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.ps-stat{background:#fff;border-radius:16px;padding:18px}
.ps-stat .n{font-size:30px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.ps-stat .l{font-size:14px;font-weight:600;margin-top:2px}
.ps-stat .p{font-size:13px;color:#6b7280;margin-top:2px}
.ps h2{font-size:17px;font-weight:700;margin:0 0 14px}
.ps-row{display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid #eef0f3;font-size:15px}
.ps-row:first-of-type{border-top:0}
.ps-row b{font-variant-numeric:tabular-nums}
.ps-indent{padding-left:16px;color:#4b5563}
.ps-note{font-size:13px;color:#6b7280;line-height:1.5;margin-top:24px}
.ps-err{background:#fff4f4;color:#9b1c1c;border-radius:12px;padding:14px;font-size:14px}
@media (max-width:560px){.ps-grid{grid-template-columns:1fr}}
`

export default async function PopupStatsPage({ searchParams }) {
  const { range: rangeParam } = await searchParams
  const rangeKey = RANGES[rangeParam] ? rangeParam : '30d'
  const range = RANGES[rangeKey]
  const { data: s, error } = await popupDb.rpc('popup_stats', { p_days: range.days })

  return (
    <main className="ps">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ps-wrap">
        <h1>Popup stats</h1>
        <p className="ps-sub">The 30-second discount popup on the service pages (V1 and V2).</p>

        <nav className="ps-tabs">
          {Object.entries(RANGES).map(([key, r]) => (
            <a key={key} className="ps-tab" href={`/popup?range=${key}`} aria-current={key === rangeKey ? 'page' : undefined}>
              {r.label}
            </a>
          ))}
        </nav>

        {error || !s ? (
          <div className="ps-err">Couldn’t load the stats. {error?.message}</div>
        ) : (
          <>
            <div className="ps-card ps-hero">
              <span className="ps-big">{s.saw}</span>
              <span className="ps-label">visitors saw the popup</span>
            </div>

            <div className="ps-grid">
              <div className="ps-stat">
                <div className="n">{s.claimed}</div>
                <div className="l">Clicked claim</div>
                <div className="p">{pct(s.claimed, s.saw)} of viewers</div>
              </div>
              <div className="ps-stat">
                <div className="n">{s.dismissed}</div>
                <div className="l">Closed it</div>
                <div className="p">{pct(s.dismissed, s.saw)} of viewers</div>
              </div>
              <div className="ps-stat">
                <div className="n">{s.left}</div>
                <div className="l">Left the website</div>
                <div className="p">{pct(s.left, s.saw)} of viewers</div>
              </div>
            </div>

            <div className="ps-card" style={{ marginTop: 16 }}>
              <h2>Of those who closed it</h2>
              <div className="ps-row"><span>Converted</span><b>{s.dismissed_converted} · {pct(s.dismissed_converted, s.dismissed)}</b></div>
              {Object.entries(s.converted_by_kind || {}).map(([kind, n]) => (
                <div key={kind} className="ps-row ps-indent"><span>{KIND_LABELS[kind] || kind}</span><b>{n}</b></div>
              ))}
              <div className="ps-row"><span>Didn’t convert</span><b>{s.dismissed - s.dismissed_converted} · {pct(s.dismissed - s.dismissed_converted, s.dismissed)}</b></div>
            </div>

            <div className="ps-card">
              <h2>Of those who clicked claim</h2>
              <div className="ps-row"><span>Converted</span><b>{s.claimed_converted} · {pct(s.claimed_converted, s.claimed)}</b></div>
              <div className="ps-row"><span>Didn’t convert</span><b>{s.claimed - s.claimed_converted} · {pct(s.claimed - s.claimed_converted, s.claimed)}</b></div>
            </div>

            <p className="ps-note">
              Counts are browser tabs. “Left the website” means they saw the popup and neither claimed nor closed it.
              “Converted” means that, in the same tab, they booked, sent a form, tapped a phone number or left their
              details in the chat after claiming or closing.
              {s.first_event ? ` First event recorded ${new Date(s.first_event).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.` : ''}
            </p>
          </>
        )}
      </div>
    </main>
  )
}
