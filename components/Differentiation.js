const ROWS = [
  {
    label: 'Scheduling',
    standard: 'Wait weeks for a slot',
    premium: 'Same-week availability',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Communication',
    standard: 'Guess what we did',
    premium: 'Walked through and explained',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'Service summary',
    standard: 'Days later, if at all',
    premium: 'Same day, in your inbox',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Cleanup standard',
    standard: 'A drop cloth and a hope',
    premium: 'HEPA vacuum + full containment',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
      </svg>
    ),
  },
  {
    label: 'Workmanship warranty',
    standard: '30 days (verbal)',
    premium: '1-year written guarantee',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: 'Pricing transparency',
    standard: 'Hidden fees, surprise upcharges',
    premium: 'Transparent pricing, always',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
];

export default function Differentiation() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="df">
        <div className="df-bg" aria-hidden="true" />
        <div className="df-container">

          <div className="df-header">
            <h2 className="df-title">
              Factors that create<br />the <span className="df-title-accent">gold standard</span>
            </h2>
            <div className="df-proof-strip">
              <span className="df-proof-text">Proof, not promises.</span>
              <span className="df-proof-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          <div className="df-card">
            <div className="df-card-glow" aria-hidden="true" />

            <div className="df-table">
              {/* Column header */}
              <div className="df-thead">
                <div className="df-cell df-cell-label" />
                <div className="df-cell df-cell-standard">
                  <span className="df-col-title">Most companies</span>
                </div>
                <div className="df-cell df-cell-premium">
                  <span className="df-col-title df-col-title-premium">Premium Chimneys</span>
                  <span className="df-col-stamp" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Gold standard
                  </span>
                </div>
              </div>

              {/* Premium column highlight */}
              <div className="df-premium-spotlight" aria-hidden="true" />

              {/* Rows */}
              {ROWS.map((r, i) => (
                <div key={i} className="df-row" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="df-cell df-cell-label">
                    <span className="df-row-icon">{r.icon}</span>
                    <span className="df-row-text">{r.label}</span>
                  </div>
                  <div className="df-cell df-cell-standard">
                    <span className="df-mark df-mark-x" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                      </svg>
                    </span>
                    <span className="df-cell-text">{r.standard}</span>
                  </div>
                  <div className="df-cell df-cell-premium">
                    <span className="df-mark df-mark-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span className="df-cell-text df-cell-text-premium">{r.premium}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="df-card-foot">
              <div className="df-foot-tally">
                <span className="df-foot-num">6</span>
                <span className="df-foot-sep">/</span>
                <span className="df-foot-tot">6</span>
              </div>
              <div className="df-foot-text">
                categories where we set the bar — every visit, every job, every customer.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const css = `
  .df {
    position: relative;
    z-index: 2;
    background: #faf9fe;
    padding: 128px 0 0;
    overflow: visible;
    font-family: 'Inter Tight', sans-serif;
  }
  .df-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 35% at 15% 18%, rgba(167,139,250,0.22), transparent 70%),
      radial-gradient(ellipse 45% 30% at 85% 38%, rgba(212,165,116,0.16), transparent 70%),
      radial-gradient(ellipse 80% 25% at 50% 0%, rgba(124,58,237,0.1), transparent 70%);
    -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 35%, transparent 75%);
            mask-image: linear-gradient(180deg, #000 0%, #000 35%, transparent 75%);
    pointer-events: none;
  }
  .df-container { position: relative; max-width: 1200px; margin: 0 auto; padding: 0 24px; }

  /* Header */
  .df-header { max-width: 760px; margin: 0 auto 64px; text-align: center; }
  .df-title {
    font-size: 48px; font-weight: 700; line-height: 1.08;
    letter-spacing: -0.04em; color: #1a1225;
    margin: 0 0 28px;
  }
  .df-title-accent {
    background: linear-gradient(135deg, #c2855a 0%, #d4a574 40%, #e8c9a0 60%, #d4a574 80%, #c2855a 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: df-shimmer 5s ease-in-out infinite;
  }
  .df-proof-strip {
    display: inline-flex; flex-direction: column; align-items: center;
    gap: 10px;
    font-family: 'Inter Tight', sans-serif;
  }
  .df-proof-text {
    font-size: 15px; font-weight: 600;
    color: #1a1225;
    letter-spacing: -0.005em;
    font-style: italic;
    position: relative;
  }
  .df-proof-text::before, .df-proof-text::after {
    content: '';
    position: absolute; top: 50%;
    width: 28px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,165,116,0.7), rgba(124,58,237,0.5));
  }
  .df-proof-text::before { right: calc(100% + 14px); transform: scaleX(-1); }
  .df-proof-text::after { left: calc(100% + 14px); }
  .df-proof-arrow {
    width: 24px; height: 24px;
    display: grid; place-items: center;
    color: #8b5c34;
    animation: df-bounce 2.2s ease-in-out infinite;
  }
  .df-proof-arrow svg { width: 18px; height: 18px; }
  @keyframes df-bounce {
    0%,100% { transform: translateY(0); opacity: 0.7; }
    50%     { transform: translateY(4px); opacity: 1; }
  }

  /* Card */
  .df-card {
    position: relative;
    border-radius: 28px;
    background: #ffffff;
    border: 1px solid rgba(124,58,237,0.12);
    overflow: hidden;
    box-shadow:
      0 24px 80px rgba(91,33,182,0.14),
      0 8px 24px rgba(91,33,182,0.06);
  }
  .df-card-glow {
    position: absolute;
    top: -2px; left: 0; right: 0;
    width: 100%; height: 4px;
    background: linear-gradient(90deg, transparent, #c2855a, #d4a574, #e8c9a0, #d4a574, #c2855a, transparent);
    background-size: 200% 100%;
    animation: df-glow 5s ease-in-out infinite;
    pointer-events: none;
  }

  /* Table */
  .df-table {
    position: relative;
    display: grid;
    grid-template-columns: 1.4fr 1fr 1.1fr;
  }

  .df-premium-spotlight {
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: calc(1.1fr);
    width: 31.4%;
    background:
      linear-gradient(180deg, rgba(212,165,116,0.05), rgba(124,58,237,0.05) 50%, rgba(212,165,116,0.04));
    border-left: 1px solid rgba(212,165,116,0.18);
    pointer-events: none;
    z-index: 0;
  }
  .df-premium-spotlight::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 30%, rgba(212,165,116,0.08) 50%, transparent 70%);
    background-size: 200% 200%;
    animation: df-sweep 6s ease-in-out infinite;
  }

  .df-thead, .df-row {
    display: contents;
  }

  .df-cell {
    position: relative;
    z-index: 1;
    padding: 22px 28px;
    display: flex; align-items: center; gap: 14px;
    border-bottom: 1px solid rgba(124,58,237,0.08);
  }
  .df-thead .df-cell {
    padding: 28px 28px 22px;
    border-bottom: 1px solid rgba(124,58,237,0.12);
  }

  .df-row .df-cell {
    opacity: 0;
    animation: df-fade 0.6s cubic-bezier(.2,.7,.2,1) forwards;
  }
  .df-row:hover .df-cell { background: rgba(124,58,237,0.025); }
  .df-row:last-child .df-cell { border-bottom: 0; }
  .df-row:hover .df-cell.df-cell-premium { background: rgba(212,165,116,0.08); }

  .df-col-title {
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.02em;
    color: #8875a8;
  }
  .df-col-title-premium { color: #1a1225; }
  .df-col-stamp {
    margin-left: auto;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px;
    border-radius: 100px;
    background: linear-gradient(135deg, rgba(212,165,116,0.18), rgba(232,201,160,0.1));
    border: 1px solid rgba(212,165,116,0.5);
    color: #8b5c34;
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 14px rgba(194,133,90,0.18);
  }
  .df-col-stamp svg {
    width: 12px; height: 12px;
    animation: df-spin 6s linear infinite;
    transform-origin: center;
  }
  @keyframes df-spin { to { transform: rotate(360deg); } }

  .df-row-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: grid; place-items: center;
    background: linear-gradient(160deg, rgba(167,139,250,0.18), rgba(124,58,237,0.06));
    border: 1px solid rgba(124,58,237,0.2);
    color: #6d28d9;
    flex-shrink: 0;
  }
  .df-row-icon svg { width: 18px; height: 18px; }
  .df-row-text {
    font-size: 15px; font-weight: 600;
    color: #1a1225;
    letter-spacing: -0.005em;
  }

  .df-mark {
    width: 22px; height: 22px;
    border-radius: 100px;
    display: grid; place-items: center;
    flex-shrink: 0;
  }
  .df-mark svg { width: 12px; height: 12px; }
  .df-mark-x {
    background: rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.08);
    color: #b8acc8;
  }
  .df-mark-check {
    background: linear-gradient(135deg, #d4a574, #c2855a);
    border: 1px solid #b07640;
    color: #fff;
    box-shadow: 0 4px 14px rgba(194,133,90,0.4);
  }

  .df-cell-text {
    font-size: 14.5px;
    color: #8875a8;
    line-height: 1.4;
  }
  .df-cell-text-premium {
    color: #1a1225;
    font-weight: 600;
  }

  /* Foot */
  .df-card-foot {
    position: relative;
    z-index: 1;
    padding: 28px 36px;
    display: flex; align-items: center; gap: 22px;
    background: linear-gradient(180deg, rgba(124,58,237,0.04), rgba(212,165,116,0.04));
    border-top: 1px solid rgba(124,58,237,0.1);
  }
  .df-foot-tally {
    display: flex; align-items: baseline; gap: 4px;
    font-variant-numeric: tabular-nums;
  }
  .df-foot-num {
    font-size: 38px; font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(180deg, #1a1225 30%, #6d28d9);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .df-foot-sep { font-size: 22px; color: rgba(0,0,0,0.2); }
  .df-foot-tot { font-size: 18px; color: rgba(0,0,0,0.4); font-weight: 600; }
  .df-foot-text {
    font-size: 14px; line-height: 1.55;
    color: #6b5b86;
    flex: 1;
  }

  @keyframes df-fade {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes df-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes df-glow {
    0%,100% { background-position: 0% 0; opacity: 0.7; }
    50%     { background-position: 200% 0; opacity: 1; }
  }
  @keyframes df-sweep {
    0%,100% { background-position: 0% 0%; }
    50%     { background-position: 100% 100%; }
  }

  @media (max-width: 960px) {
    .df { padding: 110px 0 0; }
    .df-container { padding: 0 18px; }
    .df-title { font-size: 38px; }
    .df-card { border-radius: 22px; }
    .df-table { grid-template-columns: 1fr; }
    .df-thead .df-cell-label { display: none; }
    .df-thead .df-cell-standard,
    .df-thead .df-cell-premium {
      border-bottom: 0; padding: 18px 22px 6px;
    }
    .df-cell { padding: 14px 22px; }
    .df-cell-label {
      padding-top: 22px;
      background: rgba(124,58,237,0.04);
      border-bottom: 0;
    }
    .df-row .df-cell-standard, .df-row .df-cell-premium {
      padding-left: 64px;
    }
    .df-premium-spotlight { display: none; }
    .df-row:hover .df-cell.df-cell-premium { background: rgba(212,165,116,0.08); }
    .df-cell-premium { background: rgba(212,165,116,0.04); }
    .df-col-stamp { margin-left: 0; }
    .df-card-foot { flex-direction: column; align-items: flex-start; gap: 12px; padding: 24px; }
  }
  @media (max-width: 640px) {
    .df { padding: 84px 0 0; }
    .df-container { padding: 0 16px; }
    .df-title { font-size: 30px; }
    .df-header { margin-bottom: 48px; }
  }
`;
