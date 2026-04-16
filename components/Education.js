'use client';
import FormBanner from './FormBanner';

const PROCESS_LAYERS = [
  {
    id: 'arrive',
    label: 'When we arrive',
    items: [
      { title: 'Protective setup', preview: 'Drop cloths and containment' },
      { title: 'A quick walkthrough', preview: 'So we know your setup' },
      { title: 'A clear plan', preview: 'What, how, how long' },
    ],
  },
  {
    id: 'work',
    label: "While we're there",
    items: [
      { title: 'The service you booked', preview: 'Done right the first time' },
      { title: 'Anything worth flagging', preview: 'Photos and plain explanation' },
      { title: 'Care for your home', preview: 'Careful tools, careful hands' },
    ],
  },
  {
    id: 'leave',
    label: 'Before we leave',
    items: [
      { title: 'A full cleanup', preview: "You won't know we were there" },
      { title: 'A quick walkthrough', preview: 'We show you what we did' },
      { title: 'Honest next steps', preview: 'No pressure, no upsell' },
    ],
  },
];

const SIGN_META = [
  { id: '01', code: 'Sign 01', severity: 'Routine',  tone: 'amber',  icon: <svg key="s0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg> },
  { id: '02', code: 'Sign 02', severity: 'Urgent',   tone: 'red',    icon: <svg key="s1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> },
  { id: '03', code: 'Sign 03', severity: 'Moderate', tone: 'violet', icon: <svg key="s2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> },
  { id: '04', code: 'Sign 04', severity: 'Routine',  tone: 'amber',  icon: <svg key="s3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg> },
];

const FALLBACK_SIGNS = [
  { question: 'Smoke pushing back into the room?',              diagnosis: 'Almost always a draft, blockage, or damper issue we can resolve in one visit.' },
  { question: 'A strange smell when the fireplace is unused?',  diagnosis: 'Usually creosote, animal nesting, or moisture trapped inside the flue.' },
  { question: 'Visible cracks, crumbling mortar, or staining?', diagnosis: 'Water intrusion or freeze-thaw damage — it accelerates fast if untouched.' },
  { question: 'Fires hard to start, or dying out quickly?',     diagnosis: 'Liner condition, cap blockage, or weak draft setup almost always to blame.' },
];

const NOW_BULLETS = [
  'Small issues caught while they\'re still small',
  'A single visit, a single bill, a clean report',
  'No hidden damage to chase down later',
  'Peace of mind for the entire season',
];

const WAIT_BULLETS = [
  'Small issues compound into bigger ones',
  'One job turns into multiple trips and crews',
  'Structural damage eventually enters the picture',
  'A weekend fix becomes a multi-week project',
];

export default function Education({ city, serviceData }) {
  const phoneHref = city?.phone ? `tel:${city.phone}` : '#';
  const processLayers = PROCESS_LAYERS;
  const SIGNALS = SIGN_META.map((meta, i) => ({
    ...meta,
    question:  serviceData?.[`signs_${i + 1}_title`] || FALLBACK_SIGNS[i].question,
    diagnosis: serviceData?.[`signs_${i + 1}_body`]  || FALLBACK_SIGNS[i].diagnosis,
  }));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="ed">
        <div className="ed-bg-grid" aria-hidden="true" />
        <div className="ed-bg-glow" aria-hidden="true" />
        <div className="ed-bg-scan" aria-hidden="true" />

        {/* CHAPTER 1 — Problem Awareness */}
        <div className="ed-chapter">
          <div className="pa-container">
            <div className="pa-header">
              <h2 className="pa-title">
                Does any of this<br /><span className="pa-title-accent">sound familiar?</span>
              </h2>
              <div className="ed-signal-strip" aria-hidden="true">
                <span className="ed-sig ed-sig-amber" />
                <span className="ed-sig ed-sig-red" />
                <span className="ed-sig ed-sig-violet" />
                <span className="ed-sig ed-sig-amber" />
                <span className="ed-sig-label">4 signs something&apos;s off</span>
              </div>
            </div>

            <div className="pa-feed">
              {SIGNALS.map((s, i) => (
                <a
                  key={s.id}
                  href={phoneHref}
                  className={`pa-row pa-tone-${s.tone}`}
                  style={{ animationDelay: `${i * 130}ms` }}
                  aria-label={`Call ${city?.phone_text || ''} about: ${s.question}`}
                >
                  <div className="pa-row-left">
                    <div className="pa-pulse">
                      <span className="pa-pulse-ring" />
                      <span className="pa-pulse-dot" />
                    </div>
                    <div className="pa-glyph" aria-hidden="true">{s.icon}</div>
                    <div className="pa-code">{s.code}</div>
                  </div>
                  <div className="pa-row-mid">
                    <h3 className="pa-question">{s.question}</h3>
                    <p className="pa-diagnosis">{s.diagnosis}</p>
                  </div>
                  <div className="pa-row-right">
                    <span className="pa-severity">{s.severity}</span>
                    <div className="pa-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                  </div>
                  <div className="pa-row-frame" aria-hidden="true" />
                </a>
              ))}
            </div>

            <div className="pa-foot">
              <span className="pa-foot-line" />
              <span className="pa-foot-text">Every one of these has a known fix. None of them need panic, just a professional eye.</span>
              <span className="pa-foot-line" />
            </div>
          </div>
        </div>

        {/* CHAPTER 2 — Risk / Cost of waiting */}
        <div className="ed-chapter">
          <div className="ra-container">
            <div className="ra-header">
              <h2 className="ra-title">
                Handle it now,<br /><span className="ra-title-accent-warm">not down the road</span>
              </h2>
            </div>

            <div className="ra-compare">
              <article className="ra-panel ra-panel-now">
                <div className="ra-panel-stamp">
                  <span className="ra-stamp-dot" />
                  Act today
                </div>
                <div className="ra-panel-cost-block">
                  <span className="ra-panel-cost-num">1×</span>
                </div>
                <div className="ra-panel-cost-sub">the attention today</div>
                <ul className="ra-panel-list">
                  {NOW_BULLETS.map((b, i) => (
                    <li key={i} className="ra-panel-item" style={{ animationDelay: `${i * 80}ms` }}>
                      <span className="ra-icon ra-icon-check" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <div className="ra-divider" aria-hidden="true">
                <span className="ra-divider-line" />
                <div className="ra-divider-orb">
                  <span className="ra-divider-orb-glow" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </div>
                <span className="ra-divider-line" />
              </div>

              <article className="ra-panel ra-panel-wait">
                <div className="ra-panel-aura" aria-hidden="true" />
                <div className="ra-panel-stamp ra-stamp-warm">
                  <span className="ra-stamp-dot" />
                  Wait it out
                </div>
                <div className="ra-panel-cost-block">
                  <span className="ra-panel-cost-num ra-num-warm">10×</span>
                </div>
                <div className="ra-panel-cost-sub ra-sub-warm">the cost if ignored</div>
                <ul className="ra-panel-list">
                  {WAIT_BULLETS.map((b, i) => (
                    <li key={i} className="ra-panel-item" style={{ animationDelay: `${i * 80}ms` }}>
                      <span className="ra-icon ra-icon-warn" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

          </div>

          <div className="ed-cta-wrap">
            <FormBanner />
          </div>
        </div>

        {/* CHAPTER 3 — Our Process */}
        {processLayers.length > 0 && (
          <div className="ed-chapter">
            <div className="op-container">
              <div className="op-header">
                <div className="ed-stepper" aria-hidden="true">
                  <span className="ed-step-num">01</span>
                  <span className="ed-step-line" />
                  <span className="ed-step-num">02</span>
                  <span className="ed-step-line" />
                  <span className="ed-step-num">03</span>
                </div>
                <h2 className="op-title">
                  Here&apos;s <span className="op-title-accent">how it works</span>
                </h2>
              </div>

              <div className="op-grid">
                <div className="op-grid-line" aria-hidden="true" />
                {processLayers.map((layer, li) => (
                  <article key={layer.id} className="op-card" style={{ animationDelay: `${li * 140}ms` }}>
                    <div className="op-card-ghost" aria-hidden="true">{String(li + 1).padStart(2, '0')}</div>
                    <div className="op-card-marker" aria-hidden="true">
                      <span className="op-card-marker-ring" />
                      <span className="op-card-marker-dot" />
                    </div>
                    <div className="op-card-stage">Stage {String(li + 1).padStart(2, '0')}</div>
                    <h3 className="op-card-label">{layer.label}</h3>
                    <ul className="op-list">
                      {layer.items.map((it, i) => (
                        <li key={i} className="op-item" style={{ animationDelay: `${li * 140 + i * 80 + 220}ms` }}>
                          <span className="op-item-node" aria-hidden="true" />
                          <div className="op-item-text">
                            <div className="op-item-row">
                              <span className="op-item-title">{it.title}</span>
                              {it.highlight && <span className="op-item-pill">{it.highlight}</span>}
                            </div>
                            {it.preview && <span className="op-item-preview">{it.preview}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

const css = `
  /* Unified section shell */
  .ed {
    position: relative;
    background: #06030c;
    padding: 140px 0;
    overflow: hidden;
    font-family: 'Inter Tight', sans-serif;
  }
  .ed-bg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(167,139,250,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(167,139,250,0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%);
    pointer-events: none;
  }
  .ed-bg-glow {
    position: absolute; inset: 0;
    background:
      /* Top: violet arrival from light section above */
      radial-gradient(ellipse 90% 22% at 50% 0%, rgba(124,58,237,0.22), transparent 70%),
      /* Chapter 1 zone (top third): amber + magenta */
      radial-gradient(ellipse 70% 16% at 50% 16%, rgba(245,158,11,0.14), transparent 70%),
      radial-gradient(circle 700px at 12% 22%, rgba(192,132,252,0.1), transparent 70%),
      radial-gradient(circle 700px at 88% 18%, rgba(251,113,133,0.08), transparent 70%),
      /* Chapter 2 zone (middle): violet/amber split */
      radial-gradient(circle 800px at 16% 50%, rgba(124,58,237,0.17), transparent 65%),
      radial-gradient(circle 800px at 84% 50%, rgba(245,158,11,0.15), transparent 65%),
      /* Chapter 3 zone (bottom third): violet ambient */
      radial-gradient(circle 700px at 15% 80%, rgba(192,132,252,0.1), transparent 70%),
      radial-gradient(circle 700px at 85% 82%, rgba(232,121,249,0.08), transparent 70%),
      radial-gradient(ellipse 90% 20% at 50% 100%, rgba(124,58,237,0.12), transparent 70%);
    pointer-events: none;
  }
  .ed-bg-scan {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px);
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  .ed-chapter {
    position: relative;
    z-index: 1;
  }
  .ed-chapter + .ed-chapter { margin-top: 160px; }

  /* ── Shared fluid-header extras ── */
  .ed-signal-strip {
    display: inline-flex; align-items: center; gap: 8px;
    margin-top: 22px;
    padding: 8px 14px;
    border-radius: 100px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(6px);
  }
  .ed-sig {
    width: 8px; height: 8px; border-radius: 100px;
    animation: pa-pulse 1.8s ease-in-out infinite;
  }
  .ed-sig-amber  { background: #fbbf24; box-shadow: 0 0 10px rgba(251,191,36,0.8); animation-delay: 0s; }
  .ed-sig-red    { background: #fb7185; box-shadow: 0 0 10px rgba(251,113,133,0.8); animation-delay: 0.25s; }
  .ed-sig-violet { background: #a78bfa; box-shadow: 0 0 10px rgba(167,139,250,0.8); animation-delay: 0.5s; }
  .ed-sig-amber:last-of-type { animation-delay: 0.75s; }
  .ed-sig-label {
    margin-left: 6px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.55);
  }

  .ed-stepper {
    display: inline-flex; align-items: center; gap: 14px;
    margin-bottom: 26px;
    font-variant-numeric: tabular-nums;
  }
  .ed-step-num {
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.14em;
    color: #c4b5fd;
    padding: 6px 11px;
    border: 1px solid rgba(167,139,250,0.35);
    background: rgba(167,139,250,0.08);
    border-radius: 6px;
  }
  .ed-step-line {
    width: 28px; height: 1px;
    background: linear-gradient(90deg, rgba(167,139,250,0.6), rgba(232,121,249,0.6));
  }

  .ra-title-accent-cool {
    background: linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6, #a78bfa, #c4b5fd);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ra-shimmer 5s ease-in-out infinite;
  }
  .ra-title-accent-warm {
    background: linear-gradient(135deg, #fde68a, #fbbf24, #fb923c, #fbbf24, #fde68a);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ra-shimmer 5s ease-in-out infinite;
  }
  .op-title-accent {
    background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ra-shimmer 4s ease-in-out infinite;
  }

  /* ─────────────── Chapter 1 : Problem Awareness ─────────────── */
  .pa-container { position: relative; max-width: 1200px; margin: 0 auto; padding: 0 24px; }

  .pa-header { max-width: 760px; margin: 0 auto 72px; text-align: center; }
  .pa-tag {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 9px 16px;
    border-radius: 100px;
    border: 1px solid rgba(245,158,11,0.4);
    background: rgba(245,158,11,0.06);
    color: #fbbf24;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.18em;
    margin-bottom: 22px;
    backdrop-filter: blur(8px);
  }
  .pa-tag-dot {
    width: 7px; height: 7px; border-radius: 100px;
    background: #fbbf24;
    box-shadow: 0 0 14px #fbbf24;
    animation: pa-pulse 1.6s ease-in-out infinite;
  }
  .pa-title {
    font-size: 48px; font-weight: 700; line-height: 1.08;
    letter-spacing: -0.04em; color: #fff;
    margin: 0 0 18px;
  }
  .pa-title-accent {
    background: linear-gradient(135deg, #fbbf24, #fb923c, #f97316, #fb923c, #fbbf24);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: pa-shimmer 4s ease-in-out infinite;
  }
  .pa-lede { font-size: 16px; line-height: 1.65; color: rgba(255,255,255,0.55); margin: 0; }

  .pa-feed { display: flex; flex-direction: column; gap: 14px; }
  .pa-row {
    position: relative;
    display: grid;
    grid-template-columns: 200px 1fr auto;
    align-items: center;
    gap: 32px;
    padding: 28px 36px;
    border-radius: 18px;
    background: linear-gradient(120deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01));
    border: 1px solid rgba(255,255,255,0.08);
    overflow: hidden;
    opacity: 0;
    animation: pa-slide 0.7s cubic-bezier(.2,.7,.2,1) forwards;
    transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  .pa-row-frame {
    position: absolute; inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(120deg, var(--tone, rgba(245,158,11,0.5)), transparent 40%, transparent 70%, rgba(192,132,252,0.2));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    pointer-events: none;
  }
  .pa-row::after {
    content: '';
    position: absolute;
    left: -2px; top: 0; bottom: 0;
    width: 3px;
    background: var(--tone, #f59e0b);
    box-shadow: 0 0 18px var(--tone, rgba(245,158,11,0.6));
    opacity: 0.85;
  }
  .pa-row:hover { transform: translateX(4px); border-color: rgba(255,255,255,0.18); box-shadow: 0 18px 50px rgba(0,0,0,0.4); }

  .pa-tone-amber  { --tone: rgba(245,158,11,0.7); }
  .pa-tone-amber  .pa-row-frame { background: linear-gradient(120deg, rgba(245,158,11,0.5), transparent 50%, rgba(192,132,252,0.18)); }
  .pa-tone-red    { --tone: rgba(251,113,133,0.7); }
  .pa-tone-red    .pa-row-frame { background: linear-gradient(120deg, rgba(251,113,133,0.5), transparent 50%, rgba(192,132,252,0.18)); }
  .pa-tone-violet { --tone: rgba(167,139,250,0.7); }
  .pa-tone-violet .pa-row-frame { background: linear-gradient(120deg, rgba(167,139,250,0.5), transparent 50%, rgba(245,158,11,0.18)); }

  .pa-row-left { display: flex; align-items: center; gap: 18px; }
  .pa-pulse { position: relative; width: 14px; height: 14px; flex-shrink: 0; }
  .pa-pulse-dot {
    position: absolute; inset: 3px; border-radius: 100px;
    background: var(--tone, #f59e0b);
    box-shadow: 0 0 14px var(--tone, rgba(245,158,11,0.8));
  }
  .pa-pulse-ring {
    position: absolute; inset: 0; border-radius: 100px;
    border: 1.5px solid var(--tone, rgba(245,158,11,0.6));
    animation: pa-ring 2s ease-out infinite;
  }
  .pa-glyph {
    width: 42px; height: 42px; flex-shrink: 0;
    display: grid; place-items: center;
    border-radius: 12px;
    background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
    border: 1px solid var(--tone, rgba(245,158,11,0.4));
    color: #fff;
    box-shadow: 0 0 16px color-mix(in srgb, var(--tone, rgba(245,158,11,0.4)) 40%, transparent),
                inset 0 1px 0 rgba(255,255,255,0.08);
  }
  .pa-glyph svg { width: 22px; height: 22px; }
  .pa-code {
    font-size: 10px; font-weight: 700; letter-spacing: 0.16em;
    color: rgba(255,255,255,0.55);
    font-variant-numeric: tabular-nums;
    padding: 5px 8px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    background: rgba(255,255,255,0.02);
  }
  .pa-row-mid { min-width: 0; }
  .pa-question { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; color: #fff; margin: 0 0 6px; }
  .pa-diagnosis { font-size: 14px; line-height: 1.55; color: rgba(255,255,255,0.55); margin: 0; }
  .pa-row-right { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
  .pa-severity {
    font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
    color: #fff;
    padding: 7px 12px; border-radius: 100px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.15);
    white-space: nowrap;
  }
  .pa-tone-amber  .pa-severity { color: #fbbf24; border-color: rgba(251,191,36,0.4); background: rgba(245,158,11,0.08); }
  .pa-tone-red    .pa-severity { color: #fda4af; border-color: rgba(251,113,133,0.4); background: rgba(251,113,133,0.08); }
  .pa-tone-violet .pa-severity { color: #c4b5fd; border-color: rgba(167,139,250,0.4); background: rgba(167,139,250,0.08); }
  .pa-arrow {
    width: 38px; height: 38px;
    display: grid; place-items: center;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.7);
    transition: all 0.3s ease;
  }
  .pa-arrow svg { width: 16px; height: 16px; }
  .pa-row:hover .pa-arrow {
    background: var(--tone, rgba(245,158,11,0.18));
    border-color: var(--tone, rgba(245,158,11,0.6));
    color: #fff; transform: translateX(2px);
  }
  .pa-foot { margin-top: 56px; display: flex; align-items: center; gap: 20px; justify-content: center; }
  .pa-foot-line { flex: 0 0 80px; height: 1px; background: linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent); }
  .pa-foot-text { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55); letter-spacing: 0.02em; }

  @keyframes pa-slide { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes pa-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
  @keyframes pa-ring { 0% { transform: scale(0.9); opacity: 0.9; } 100% { transform: scale(2.4); opacity: 0; } }
  @keyframes pa-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

  /* ─────────────── Chapter 2 : Risk / Cost of waiting ─────────────── */
  .ra-container { position: relative; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .ra-header { max-width: 760px; margin: 0 auto 80px; text-align: center; }
  .ra-tag {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 9px 16px;
    border-radius: 100px;
    border: 1px solid rgba(167,139,250,0.3);
    background: rgba(124,58,237,0.08);
    color: #c4b5fd;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.18em;
    margin-bottom: 22px;
    backdrop-filter: blur(8px);
  }
  .ra-tag-dot { width: 7px; height: 7px; border-radius: 100px; background: #c084fc; box-shadow: 0 0 14px #c084fc; animation: ra-pulse 2s ease-in-out infinite; }
  .ra-title { font-size: 48px; font-weight: 700; line-height: 1.08; letter-spacing: -0.04em; color: #fff; margin: 0 0 18px; }
  .ra-title-accent {
    background: linear-gradient(135deg, #a78bfa, #c084fc, #fbbf24, #c084fc, #a78bfa);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ra-shimmer 5s ease-in-out infinite;
  }
  .ra-lede { font-size: 16px; line-height: 1.65; color: rgba(255,255,255,0.55); margin: 0; }

  .ra-compare { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; align-items: stretch; }
  .ra-panel {
    position: relative;
    padding: 56px 48px 52px;
    border-radius: 26px;
    background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005));
    border: 1px solid rgba(167,139,250,0.18);
    overflow: hidden;
    backdrop-filter: blur(6px);
    transition: transform 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
  }
  .ra-panel::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(160deg, rgba(167,139,250,0.4), transparent 50%, rgba(192,132,252,0.18));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    pointer-events: none;
  }
  .ra-panel-now:hover { transform: translateY(-4px); border-color: rgba(167,139,250,0.45); box-shadow: 0 24px 60px rgba(91,33,182,0.32); }
  .ra-panel-wait::before { background: linear-gradient(160deg, rgba(245,158,11,0.5), transparent 50%, rgba(251,113,133,0.25)); }
  .ra-panel-wait { border-color: rgba(245,158,11,0.22); }
  .ra-panel-wait:hover { transform: translateY(-4px); border-color: rgba(245,158,11,0.55); box-shadow: 0 24px 60px rgba(245,158,11,0.22); }
  .ra-panel-aura {
    position: absolute; inset: -1px; border-radius: inherit;
    background: radial-gradient(ellipse 70% 50% at 50% 30%, rgba(245,158,11,0.18), transparent 70%);
    pointer-events: none;
    animation: ra-warm 4s ease-in-out infinite;
  }
  .ra-panel-stamp {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 7px 13px;
    border-radius: 100px;
    background: rgba(167,139,250,0.1);
    border: 1px solid rgba(167,139,250,0.4);
    color: #c4b5fd;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.16em;
    margin-bottom: 36px;
  }
  .ra-stamp-warm { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.45); color: #fbbf24; }
  .ra-stamp-dot {
    width: 6px; height: 6px; border-radius: 100px;
    background: currentColor;
    box-shadow: 0 0 10px currentColor;
    animation: ra-pulse 1.8s ease-in-out infinite;
  }
  .ra-panel-cost-block { display: flex; align-items: flex-start; gap: 4px; line-height: 1; margin-bottom: 8px; font-variant-numeric: tabular-nums; }
  .ra-panel-cost-prefix { font-size: 32px; font-weight: 700; color: rgba(196,181,253,0.7); margin-top: 18px; }
  .ra-panel-cost-num {
    font-size: 96px; font-weight: 800; letter-spacing: -0.05em;
    background: linear-gradient(180deg, #ffffff 30%, #a78bfa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .ra-prefix-warm { color: rgba(251,191,36,0.7); margin-top: 28px; font-size: 42px; }
  .ra-num-warm {
    background: linear-gradient(180deg, #ffffff 20%, #fbbf24 70%, #fb923c);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .ra-panel-cost-sub { font-size: 12px; font-weight: 600; letter-spacing: 0.12em; color: rgba(196,181,253,0.7); margin-bottom: 38px; }
  .ra-sub-warm { color: rgba(251,191,36,0.75); }
  .ra-panel-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 28px; }
  .ra-panel-item {
    display: flex; align-items: flex-start; gap: 14px;
    font-size: 14.5px; line-height: 1.55; color: rgba(255,255,255,0.78);
    opacity: 0;
    animation: ra-fade 0.6s cubic-bezier(.2,.7,.2,1) forwards;
  }
  .ra-icon { width: 22px; height: 22px; flex-shrink: 0; border-radius: 100px; display: grid; place-items: center; margin-top: 1px; }
  .ra-icon svg { width: 13px; height: 13px; }
  .ra-icon-check {
    background: linear-gradient(135deg, rgba(167,139,250,0.35), rgba(124,58,237,0.18));
    border: 1px solid rgba(167,139,250,0.5);
    color: #ddd6fe;
    box-shadow: 0 0 12px rgba(124,58,237,0.3);
  }
  .ra-icon-warn {
    background: linear-gradient(135deg, rgba(245,158,11,0.3), rgba(251,113,133,0.15));
    border: 1px solid rgba(245,158,11,0.55);
    color: #fde68a;
    box-shadow: 0 0 12px rgba(245,158,11,0.32);
  }
  .ra-divider { display: flex; flex-direction: column; align-items: center; padding: 0 24px; gap: 16px; }
  .ra-divider-line { flex: 1; width: 1px; background: linear-gradient(180deg, transparent, rgba(167,139,250,0.4), rgba(245,158,11,0.4), transparent); }
  .ra-divider-orb {
    position: relative;
    width: 56px; height: 56px;
    border-radius: 100px;
    display: grid; place-items: center;
    background: rgba(10,5,20,0.8);
    border: 1px solid rgba(192,132,252,0.5);
    color: #ffffff;
    box-shadow: 0 0 32px rgba(124,58,237,0.4);
    backdrop-filter: blur(8px);
  }
  .ra-divider-orb svg { width: 22px; height: 22px; }
  .ra-divider-orb-glow {
    position: absolute; inset: -8px; border-radius: inherit;
    background: conic-gradient(from 0deg, rgba(167,139,250,0.4), rgba(245,158,11,0.4), rgba(167,139,250,0.4));
    filter: blur(12px); opacity: 0.6;
    animation: ra-spin 8s linear infinite;
    z-index: -1;
  }
  .ed-cta-wrap { margin-top: 72px; }

  @keyframes ra-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ra-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.9); } }
  @keyframes ra-warm { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
  @keyframes ra-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes ra-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }

  /* ─────────────── Chapter 3 : Our Process ─────────────── */
  .op-container { position: relative; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .op-header { max-width: 780px; margin: 0 auto 80px; text-align: center; }
  .op-title { font-size: 48px; font-weight: 700; line-height: 1.08; letter-spacing: -0.04em; margin: 0; color: #ffffff; }

  .op-grid { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .op-grid-line {
    position: absolute;
    top: 64px; left: 60px; right: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.35) 10%, rgba(232,121,249,0.45) 50%, rgba(167,139,250,0.35) 90%, transparent);
    pointer-events: none;
  }
  .op-card {
    position: relative;
    padding: 48px 40px 44px;
    border-radius: 22px;
    background: linear-gradient(180deg, rgba(124,58,237,0.08), rgba(10,5,20,0.2) 60%), rgba(255,255,255,0.02);
    border: 1px solid rgba(167,139,250,0.18);
    overflow: hidden;
    backdrop-filter: blur(6px);
    opacity: 0;
    animation: op-rise 0.8s cubic-bezier(.2,.7,.2,1) forwards;
    transition: border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
  }
  .op-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,121,249,0.8), transparent);
  }
  .op-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(160deg, rgba(192,132,252,0.25), transparent 40%, transparent 70%, rgba(232,121,249,0.18));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    pointer-events: none;
  }
  .op-card:hover { transform: translateY(-4px); border-color: rgba(192,132,252,0.45); box-shadow: 0 24px 60px rgba(91,33,182,0.35), 0 0 0 1px rgba(192,132,252,0.15); }
  .op-card-ghost {
    position: absolute;
    top: -34px; right: -12px;
    font-size: 220px; font-weight: 800;
    line-height: 0.8; letter-spacing: -0.06em;
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(167,139,250,0.1);
    pointer-events: none; user-select: none;
  }
  .op-card-marker { position: absolute; top: 64px; left: 50%; transform: translate(-50%, -50%); width: 18px; height: 18px; }
  .op-card-marker-ring { position: absolute; inset: 0; border-radius: 100px; border: 1px solid rgba(192,132,252,0.5); background: #06030c; }
  .op-card-marker-dot {
    position: absolute; inset: 4px; border-radius: 100px;
    background: linear-gradient(135deg, #a78bfa, #e879f9);
    box-shadow: 0 0 16px rgba(192,132,252,0.75);
    animation: op-pulse 2.6s ease-in-out infinite;
  }
  .op-card-stage {
    position: relative; display: inline-block; margin-top: 36px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
    color: #c4b5fd;
    padding: 6px 12px;
    border: 1px solid rgba(167,139,250,0.3);
    background: rgba(167,139,250,0.08);
    border-radius: 6px;
    font-variant-numeric: tabular-nums;
  }
  .op-card-label { position: relative; font-size: 26px; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 18px 0 32px; line-height: 1.15; }
  .op-list { position: relative; list-style: none; margin: 0; padding: 0 0 0 22px; display: flex; flex-direction: column; gap: 22px; }
  .op-list::before { content: ''; position: absolute; left: 0; top: 6px; bottom: 6px; width: 1px; background: linear-gradient(180deg, rgba(167,139,250,0.45), rgba(167,139,250,0.08)); }
  .op-item { position: relative; display: flex; align-items: flex-start; gap: 14px; opacity: 0; animation: op-fade 0.6s cubic-bezier(.2,.7,.2,1) forwards; }
  .op-item-node {
    position: absolute; left: -26px; top: 7px;
    width: 9px; height: 9px; border-radius: 100px;
    background: #06030c;
    border: 1.5px solid rgba(192,132,252,0.7);
    box-shadow: 0 0 10px rgba(192,132,252,0.5);
  }
  .op-item-text { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .op-item-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .op-item-title { font-size: 16px; font-weight: 600; color: #fff; letter-spacing: -0.01em; line-height: 1.3; }
  .op-item-preview { font-size: 12px; font-weight: 500; color: rgba(196,181,253,0.65); letter-spacing: 0.02em; }
  .op-item-pill {
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em;
    color: #f0abfc;
    padding: 3px 8px;
    border: 1px solid rgba(232,121,249,0.45);
    background: rgba(232,121,249,0.1);
    border-radius: 100px;
  }

  @keyframes op-rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes op-fade { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes op-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.55; transform: scale(0.92); } }

  /* Responsive */
  @media (max-width: 1040px) {
    .ed { padding: 110px 0; }
    .pa-container, .ra-container, .op-container { padding: 0 20px; }
    .ed-chapter + .ed-chapter { margin-top: 120px; }
    .pa-title, .ra-title { font-size: 38px; }
    .op-title { font-size: 38px; }
    .pa-row { grid-template-columns: 1fr; gap: 18px; padding: 24px 26px; }
    .pa-row-right { width: 100%; justify-content: space-between; }
    .pa-row-left { width: 100%; }
    .ra-compare { grid-template-columns: 1fr; gap: 20px; }
    .ra-divider { flex-direction: row; padding: 8px 0; gap: 16px; }
    .ra-divider-line { width: auto; height: 1px; flex: 1; background: linear-gradient(90deg, transparent, rgba(167,139,250,0.4), rgba(245,158,11,0.4), transparent); }
    .ra-divider-orb { transform: rotate(90deg); }
    .ra-panel { padding: 44px 32px; }
    .ra-panel-cost-num { font-size: 80px; }
    .op-grid { grid-template-columns: 1fr; gap: 20px; }
    .op-grid-line { display: none; }
    .op-card { padding: 40px 32px 36px; }
    .op-card-ghost { font-size: 180px; top: -20px; }
    .op-card-marker { top: 40px; left: 40px; transform: none; }
    .op-card-stage { margin-top: 24px; }
  }
  @media (max-width: 640px) {
    .ed { padding: 84px 0; }
    .pa-container, .ra-container, .op-container { padding: 0 18px; }
    .ed-chapter + .ed-chapter { margin-top: 96px; }
    .pa-title, .ra-title { font-size: 30px; }
    .pa-header { margin-bottom: 48px; }
    .pa-question { font-size: 18px; }
    .pa-glyph { width: 36px; height: 36px; }
    .pa-glyph svg { width: 18px; height: 18px; }
    .pa-foot-line { flex: 0 0 30px; }
    .ra-header { margin-bottom: 56px; }
    .ra-panel { padding: 36px 26px; }
    .ra-panel-cost-num { font-size: 64px; }
    .ra-prefix-warm { font-size: 32px; margin-top: 18px; }
    .ra-panel-cost-prefix { font-size: 24px; margin-top: 14px; }
    .op-header { margin-bottom: 56px; }
    .op-card { padding: 36px 24px 32px; }
    .op-card-label { font-size: 22px; }
    .op-card-ghost { font-size: 140px; }
  }
`;
