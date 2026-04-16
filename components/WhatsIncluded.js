'use client';
import { useEffect } from 'react';
import { getCalendlyUrl } from '@/lib/useCalendlyTracking';

const ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></svg>,
];

const FALLBACK = [
  { title: 'Photo documentation', text: 'Before, during, and after photos of every step we perform — saved to your file.' },
  { title: 'Detailed written report', text: 'Findings, code references, and prioritized recommendations — delivered same day.' },
  { title: 'Upfront honest pricing', text: 'Written estimate before any work begins. No surprise fees, no upsell theater.' },
  { title: 'Spotless cleanup', text: 'Drop cloths, HEPA vacuum, and a workspace cleaner than we found it.' },
];

export default function WhatsIncluded({ city, serviceData }) {
  const ITEMS = [1, 2, 3, 4].map((n, i) => ({
    title: serviceData?.[`whatsincluded_${n}_title`] || FALLBACK[i].title,
    text:  serviceData?.[`whatsincluded_${n}_body`]  || FALLBACK[i].text,
    icon:  ICONS[i],
  }));
  useEffect(() => {
    try {
      const btn = document.getElementById('wiCtaBtn');
      if (!btn) return;
      const handler = () => {
        const url = getCalendlyUrl('https://calendly.com/premiumchimneys/inspection');
        const open = () => { if (window.Calendly) window.Calendly.initPopupWidget({ url }); };
        if (window.Calendly) open();
        else {
          const t = setInterval(() => { if (window.Calendly) { clearInterval(t); open(); } }, 100);
        }
      };
      btn.addEventListener('click', handler);
      return () => btn.removeEventListener('click', handler);
    } catch (e) { console.error('[WhatsIncluded cta]', e); }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="wi">
        <div className="wi-bg" aria-hidden="true" />
        <div className="wi-container">

          <div className="wi-header">
            <h2 className="wi-title">
              What to expect during <span className="wi-title-accent">our visit</span>
            </h2>
            <p className="wi-lede">Every service call comes with the same four guarantees — no exceptions, no fine print.</p>
          </div>

          <div className="wi-grid">
            <div className="wi-image-wrap">
              <div className="wi-image-frame">
                <img
                  className="wi-image"
                  src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694318b71802992e9f185df1_premium-chimneys-certified-chimney-technician-fireplace-inspection.webp"
                  alt="Premium Chimneys technician on a rooftop"
                />
                <div className="wi-image-shade" />
                <div className="wi-image-badge">
                  <span className="wi-image-badge-dot" />
                  Every visit. Every time.
                </div>
              </div>
            </div>

            <div className="wi-cards">
              {ITEMS.map((it, i) => (
                <div key={i} className="wi-card" style={{ animationDelay: `${i * 110}ms` }}>
                  <div className="wi-card-orb" aria-hidden="true">
                    <div className="wi-card-orb-glow" />
                    <div className="wi-card-orb-icon">{it.icon}</div>
                  </div>
                  <div className="wi-card-text">
                    <h3 className="wi-card-title">{it.title}</h3>
                    <p className="wi-card-body">{it.text}</p>
                  </div>
                  <div className="wi-card-num">{String(i + 1).padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA BANNER */}
          <div className="wi-cta">
            <div className="wi-cta-badge">
              <span className="wi-cta-badge-label">Rated</span>
              <span className="wi-cta-badge-amount">#1</span>
              <span className="wi-cta-badge-sub">in your area</span>
            </div>
            <div className="wi-cta-content">
              <p className="wi-cta-heading">Schedule your appointment today</p>
              <p className="wi-cta-desc">Our certified technicians are available this week. Book now and get a full chimney or fireplace assessment.</p>
              <div className="wi-cta-features">
                <span className="wi-cta-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Same-week availability</span>
                <span className="wi-cta-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Insured & Bonded</span>
                <span className="wi-cta-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Satisfaction guaranteed</span>
              </div>
            </div>
            <div className="wi-cta-action">
              <button type="button" className="wi-cta-btn" id="wiCtaBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8" /></svg>
                Book Appointment
              </button>
              <a href={`tel:${city?.phone ?? ''}`} className="wi-cta-call">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {city?.phone_text}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const css = `
  .wi {
    position: relative;
    background: #faf9fe;
    padding: 130px 0;
    overflow: hidden;
    font-family: 'Inter Tight', sans-serif;
  }
  .wi-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 15% 30%, rgba(167,139,250,0.22), transparent 70%),
      radial-gradient(ellipse 50% 40% at 85% 70%, rgba(232,121,249,0.14), transparent 70%),
      linear-gradient(180deg, #faf9fe, #f3edff);
    pointer-events: none;
  }
  .wi-container { position: relative; max-width: 1200px; margin: 0 auto; padding: 0 24px; }

  .wi-header { max-width: 780px; margin: 0 auto 64px; text-align: center; }
  .wi-title {
    font-size: 48px; font-weight: 700; line-height: 1.08;
    letter-spacing: -0.04em; margin: 0 0 16px;
    color: #1a1225;
  }
  @keyframes wiShimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  .wi-title-accent {
    background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: wiShimmer 4s ease-in-out infinite;
  }
  .wi-lede { font-size: 16px; line-height: 1.65; color: #6b5b86; margin: 0; }

  .wi-grid {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 56px;
    align-items: stretch;
  }

  .wi-image-wrap { position: relative; }
  .wi-image-frame {
    position: relative;
    height: 100%;
    min-height: 560px;
    border-radius: 26px;
    overflow: hidden;
    box-shadow:
      0 30px 80px rgba(91,33,182,0.28),
      0 8px 24px rgba(91,33,182,0.12),
      inset 0 0 0 1px rgba(255,255,255,0.4);
  }
  .wi-image {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 1.2s ease;
  }
  .wi-image-frame:hover .wi-image { transform: scale(1.04); }
  .wi-image-shade {
    position: absolute; inset: 0;
    background:
      linear-gradient(180deg, rgba(13,5,28,0.05) 0%, rgba(13,5,28,0.55) 100%),
      linear-gradient(135deg, rgba(124,58,237,0.18), transparent 50%);
    pointer-events: none;
  }
  .wi-image-badge {
    position: absolute;
    bottom: 28px; left: 28px;
    display: inline-flex; align-items: center; gap: 10px;
    padding: 12px 18px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 100px;
    color: #fff;
    font-size: 13px; font-weight: 600;
    letter-spacing: 0.04em;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }
  .wi-image-badge-dot {
    width: 7px; height: 7px; border-radius: 100px;
    background: #c084fc;
    box-shadow: 0 0 12px #c084fc;
    animation: wi-pulse 2s ease-in-out infinite;
  }

  .wi-cards { display: flex; flex-direction: column; gap: 16px; }
  .wi-card {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 22px;
    padding: 24px 28px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.45));
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.7);
    box-shadow:
      0 14px 40px rgba(91,33,182,0.1),
      0 1px 0 rgba(255,255,255,0.8) inset;
    opacity: 0;
    transform: translateY(16px);
    animation: wi-rise 0.7s cubic-bezier(.2,.7,.2,1) forwards;
    transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
    flex: 1;
    min-height: 0;
  }
  .wi-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(167,139,250,0.5), transparent 50%, rgba(232,121,249,0.3));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    pointer-events: none;
  }
  .wi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(167,139,250,0.6);
    box-shadow:
      0 22px 60px rgba(91,33,182,0.18),
      0 1px 0 rgba(255,255,255,0.9) inset;
  }
  .wi-card-orb {
    position: relative;
    width: 56px; height: 56px;
    border-radius: 18px;
    display: grid; place-items: center;
    background: linear-gradient(160deg, rgba(167,139,250,0.35), rgba(232,121,249,0.18));
    border: 1px solid rgba(167,139,250,0.4);
    box-shadow:
      0 8px 24px rgba(124,58,237,0.25),
      inset 0 1px 0 rgba(255,255,255,0.6);
    flex-shrink: 0;
  }
  .wi-card-orb-glow {
    position: absolute; inset: -8px;
    border-radius: inherit;
    background: radial-gradient(circle, rgba(192,132,252,0.35), transparent 70%);
    filter: blur(8px);
    pointer-events: none;
    z-index: 0;
  }
  .wi-card-orb-icon {
    position: relative;
    z-index: 1;
    width: 26px; height: 26px;
    color: #6d28d9;
  }
  .wi-card-orb-icon svg { width: 100%; height: 100%; display: block; }
  .wi-card-title {
    font-size: 17px; font-weight: 700;
    letter-spacing: -0.015em;
    color: #1a1225;
    margin: 0 0 4px;
    line-height: 1.25;
  }
  .wi-card-body {
    font-size: 13.5px; line-height: 1.55;
    color: #6b5b86;
    margin: 0;
  }
  .wi-card-num {
    font-size: 32px; font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1.2px rgba(124,58,237,0.3);
    font-variant-numeric: tabular-nums;
  }

  /* CTA BANNER (mirrors Services sv1-cta) */
  .wi-cta {
    margin-top: 56px;
    border-radius: 20px;
    background: linear-gradient(135deg,#0e0b14,#1a1030 50%,#0e0b14);
    border: 1px solid rgba(124,58,237,.2);
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0;
    position: relative;
    overflow: hidden;
    transition: all .3s ease;
  }
  .wi-cta:hover { border-color: rgba(124,58,237,.4); box-shadow: 0 16px 48px rgba(124,58,237,.12), 0 0 80px rgba(124,58,237,.04); }
  .wi-cta::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #7c3aed, #a78bfa, #c084fc, #a78bfa, #7c3aed, transparent);
    background-size: 300% 100%;
    animation: wi-cta-anim 4s ease-in-out infinite;
    z-index: 2;
  }
  @keyframes wi-cta-anim { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  .wi-cta::after {
    content: '';
    position: absolute; left: 40px; top: 50%;
    transform: translateY(-50%);
    width: 120px; height: 120px;
    background: radial-gradient(circle, rgba(124,58,237,.2) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
    animation: wi-cta-glow 3s ease-in-out infinite;
  }
  @keyframes wi-cta-glow { 0%,100% { opacity: .6; transform: translateY(-50%) scale(1); } 50% { opacity: 1; transform: translateY(-50%) scale(1.2); } }
  .wi-cta-badge { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; flex-shrink: 0; padding: 32px 36px; position: relative; z-index: 1; }
  .wi-cta-badge-label { font-size: 12px; font-weight: 700; color: #a78bfa; letter-spacing: .02em; margin-bottom: 4px; }
  .wi-cta-badge-amount { font-size: 40px; font-weight: 800; letter-spacing: -.03em; line-height: 1; background: linear-gradient(180deg,#fff 30%,#a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .wi-cta-badge-sub { font-size: 11px; font-weight: 500; color: rgba(255,255,255,.35); margin-top: 2px; }
  .wi-cta-content { padding: 32px 36px; position: relative; z-index: 1; }
  .wi-cta-heading { font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 6px; letter-spacing: -.02em; }
  .wi-cta-desc { font-size: 14px; font-weight: 400; color: rgba(255,255,255,.45); margin: 0 0 16px; line-height: 1.5; }
  .wi-cta-features { display: flex; gap: 20px; }
  .wi-cta-feature { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: rgba(255,255,255,.6); }
  .wi-cta-feature svg { flex-shrink: 0; }
  .wi-cta-action { padding: 32px 36px; display: flex; flex-direction: column; align-items: center; gap: 10px; position: relative; z-index: 1; }
  .wi-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 15px; font-weight: 600; color: #f0e0fd;
    padding: 14px 32px; border-radius: 12px;
    border: 1px solid #7c3aed;
    background: linear-gradient(160deg,#9b5de5,#7c3aed 25%,#5b21b6 50%,#6d28d9 72%,#8b5cf6);
    box-shadow: inset 0 1px 0 rgba(196,155,240,.55), inset 0 -1px 0 rgba(0,0,0,.22), 0 4px 20px rgba(91,33,182,.5);
    transition: all .22s ease;
    position: relative; overflow: hidden;
    cursor: pointer;
    text-shadow: 0 1px 2px rgba(45,15,80,.35);
    text-decoration: none; white-space: nowrap;
    width: 100%; justify-content: center;
  }
  .wi-cta-btn::before {
    content: '';
    position: absolute; top: 0; left: -70%;
    width: 40%; height: 100%;
    background: linear-gradient(105deg, transparent 35%, rgba(210,175,255,.35) 50%, transparent 65%);
    transform: skewX(-12deg);
    pointer-events: none;
    transition: left .55s ease;
  }
  .wi-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: inset 0 1px 0 rgba(196,155,240,.55), inset 0 -1px 0 rgba(0,0,0,.22), 0 8px 28px rgba(91,33,182,.6);
    border-color: #8b5cf6;
  }
  .wi-cta-btn:hover::before { left: 130%; }
  .wi-cta-call {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 14px; font-weight: 500;
    color: rgba(255,255,255,.7);
    text-decoration: none;
    padding: 12px 24px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.04);
    transition: all .22s ease;
    white-space: nowrap; width: 100%;
  }
  .wi-cta-call:hover { color: #fff; border-color: rgba(255,255,255,.2); background: rgba(255,255,255,.08); transform: translateY(-1px); }

  @keyframes wi-rise { to { opacity: 1; transform: translateY(0); } }
  @keyframes wi-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  @media (max-width: 1040px) {
    .wi { padding: 100px 0; }
    .wi-container { padding: 0 20px; }
    .wi-grid { grid-template-columns: 1fr; gap: 36px; }
    .wi-image-frame { min-height: 380px; }
    .wi-cta { grid-template-columns: 1fr; }
    .wi-cta-badge { padding: 24px; }
    .wi-cta-content { padding: 24px; }
    .wi-cta-action { padding: 24px; }
    .wi-cta-features { flex-wrap: wrap; }
  }
  @media (max-width: 640px) {
    .wi { padding: 80px 0; }
    .wi-container { padding: 0 18px; }
    .wi-title { font-size: 38px; }
    .wi-header { margin-bottom: 44px; }
    .wi-image-frame { min-height: 300px; }
    .wi-card { padding: 20px 22px; gap: 16px; grid-template-columns: auto 1fr; }
    .wi-card-num { display: none; }
    .wi-card-orb { width: 48px; height: 48px; border-radius: 14px; }
    .wi-card-orb-icon { width: 22px; height: 22px; }
    .wi-card-title { font-size: 16px; }
    .wi-cta-badge { text-align: left; padding: 24px 24px 16px; }
    .wi-cta-badge-amount { font-size: 48px; }
    .wi-cta-content { text-align: left; padding: 0 24px 24px; }
    .wi-cta-features { flex-direction: column; gap: 8px; align-items: flex-start; }
    .wi-cta-action { align-items: stretch; padding: 0 24px 24px; }
  }
`;
