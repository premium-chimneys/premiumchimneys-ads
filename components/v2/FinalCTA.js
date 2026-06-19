'use client';

/* ============================================================
   FinalCTA — 1:1 replica of the serviceroot CtaBanner (the
   closing call-to-action at the bottom of the serviceroot page).
   Dark "smart card" shell with a MASSIVE ServiceRoot vector mark
   bleeding off all edges, lit with a green glow halo, heading /
   desc / CTA composited on top. Button wired to this site's
   data-gateway-book hook.
   ============================================================ */

function FlamesMark({ style }) {
  return (
    <svg viewBox="0 0 472 499" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={style}>
      <defs>
        <linearGradient id="ctaMarkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="52%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
      <path d="M471.118 264.071C468.562 208.05 438.118 169.873 385.036 153.777C351.175 143.545 315.623 138.879 280.689 133.114C236.436 125.805 191.559 122.211 147.738 113.038C83.2356 99.5767 34.7784 64.6791 8.93783 0C8.44329 22.7979 6.35543 45.6311 7.69423 68.3834C11.9879 139.963 47.7049 189.195 116.035 212.922C136.723 220.069 158.154 225.672 179.709 229.963L251.988 241.366C288.579 248.302 326.133 256.061 363.414 269.697C410.208 286.755 445.71 318.075 467.188 357.738C468.831 326.453 472.515 295.248 471.118 264.071Z" fill="url(#ctaMarkGrad)" />
      <path d="M341.158 330.66C301.772 316.27 259.566 308.894 218.126 301.04C139.88 286.21 60.208 275.651 6.56322 198.594C-2.24342 239.582 -3.76845 273.974 11.9287 307.825C33.2522 353.806 74.1029 374.243 119.181 385.615C173.25 399.253 228.515 408.073 283.104 419.723C336.364 431.088 388.482 445.101 419.599 498.392C440.2 423.829 409.598 355.665 341.158 330.66Z" fill="url(#ctaMarkGrad)" />
    </svg>
  );
}

export default function FinalCTA({ landing } = {}) {
  const heading = landing?.cta_heading || 'Stop chasing your business. Start running it.';
  const subtext = landing?.cta_subtext || 'Every call, lead, and job lives in one place and finally works together. See the whole picture, catch what matters, and stay a step ahead.';
  const ctaLabel = landing?.cta || 'Book your free inspection';
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <section className="r-fundamentalsSection r-ctaSection" style={{ background: '#F5F5F7', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            className="r-fundamentalsCard"
            style={{
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              background:
                'radial-gradient(ellipse 90% 70% at 50% 4%, rgba(124, 58, 237, 0.22) 0%, rgba(124, 58, 237, 0) 60%),' +
                '#050507',
            }}
          >
            {/* Massive flames submark — bleeds off every edge, lit from within. */}
            <FlamesMark
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 'min(122%, 1160px)',
                height: 'auto',
                transform: 'translate(-50%, -50%)',
                opacity: 0.32,
                pointerEvents: 'none',
                zIndex: 0,
                filter:
                  'drop-shadow(0 0 60px rgba(139, 92, 246, 0.6)) ' +
                  'drop-shadow(0 0 150px rgba(124, 58, 237, 0.4))',
              }}
            />

            {/* Green glow halo behind the mark for depth. */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                background:
                  'radial-gradient(circle 620px at 50% 46%, rgba(167, 139, 250, 0.30) 0%, rgba(124, 58, 237, 0) 60%)',
              }}
            />

            {/* Soft vertical scrim so the type stays crisp over the mark. */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                background:
                  'linear-gradient(180deg, rgba(5,5,7,0.30) 0%, rgba(5,5,7,0.50) 50%, rgba(5,5,7,0.30) 100%)',
              }}
            />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 22,
                  padding: '6px 13px 6px 11px',
                  borderRadius: 999,
                  background: 'rgba(124, 58, 237, 0.12)',
                  border: '1px solid rgba(124, 58, 237, 0.30)',
                  color: '#c4b5fd',
                  fontFamily: "'Inter Tight', 'Inter', sans-serif",
                  fontSize: 12.5,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'none',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px 1px rgba(167,139,250,0.9)' }} />
                Let's get started
              </span>

              <h2
                className="r-fundamentalsH2"
                style={{
                  margin: '0 auto',
                  width: '100%',
                  maxWidth: 760,
                  overflowWrap: 'break-word',
                  fontFamily: "'Inter Tight', 'Inter', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '-0.024em',
                  color: '#ffffff',
                  textShadow: '0 2px 40px rgba(0, 0, 0, 0.55)',
                }}
              >
                {heading}
              </h2>

              <p
                className="r-fundamentalsSubtext"
                style={{
                  margin: '24px auto 0',
                  width: '100%',
                  maxWidth: 580,
                  overflowWrap: 'break-word',
                  fontFamily: "'Inter Tight', 'Inter', sans-serif",
                  fontWeight: 500,
                  lineHeight: 1.55,
                  letterSpacing: '-0.005em',
                  color: '#c4c7cf',
                }}
              >
                {subtext}
              </p>

              <div style={{ marginTop: 38 }}>
                <span className="hero-cta-wrap">
                  <button type="button" className="hero-cta-primary" data-gateway-book>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {ctaLabel}
                  </button>
                  <span className="hero-cta-badge">
                    100% OFF
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&display=swap');

  /* ── Section ── */
  .r-fundamentalsSection { padding: 64px 0; }
  .r-ctaSection { padding-bottom: 128px; }
  @media (max-width: 720px) {
    .r-fundamentalsSection { padding: 32px 0; }
    /* No bottom padding on mobile so the full-bleed dark card meets the footer with no light strip */
    .r-ctaSection { padding-bottom: 0; }
  }

  /* ── Dark card ── */
  .r-fundamentalsCard { padding: 100px; border-radius: 24px; }
  @media (max-width: 1100px) { .r-fundamentalsCard { padding: 72px 56px; } }
  @media (max-width: 920px)  { .r-fundamentalsCard { padding: 56px 32px; border-radius: 20px; } }
  @media (max-width: 720px)  {
    .r-fundamentalsCard {
      padding: 48px 24px;
      border-radius: 0 !important;
      border-left: none !important;
      border-right: none !important;
      margin-left: -24px;
      margin-right: -24px;
    }
  }
  @media (max-width: 560px)  { .r-fundamentalsCard { padding: 36px 20px; } }

  /* ── Heading ── */
  .r-fundamentalsH2 { font-size: 64px; line-height: 1.1; }
  @media (max-width: 920px) { .r-fundamentalsH2 { font-size: 44px; line-height: 1.12; } }
  @media (max-width: 560px) { .r-fundamentalsH2 { font-size: 30px; line-height: 1.15; } }

  /* ── Subtext ── */
  .r-fundamentalsSubtext { font-size: clamp(13px, 1vw, 18px); }
  @media (max-width: 560px) { .r-fundamentalsSubtext { font-size: 14px; line-height: 1.5; } }

  /* ── EXACT hero primary CTA (.hero-cta-wrap + .hero-cta-primary + .hero-cta-badge) ── */
  .hero-cta-wrap { position: relative; display: inline-block; }
  .hero-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Inter Tight', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #f0e0fd;
    text-decoration: none;
    padding: 20px 24px;
    border: 1px solid #7c3aed;
    border-radius: 10px;
    background: linear-gradient(160deg, #9b5de5 0%, #7c3aed 25%, #5b21b6 50%, #6d28d9 72%, #8b5cf6 100%);
    box-shadow: none;
    cursor: pointer;
    transition: all 0.22s ease;
    position: relative;
    overflow: hidden;
    text-shadow: 0 1px 2px rgba(45, 15, 80, 0.35);
  }
  .hero-cta-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -70%;
    width: 40%;
    height: 100%;
    background: linear-gradient(105deg, transparent 35%, rgba(210, 175, 255, 0.35) 50%, transparent 65%);
    transform: skewX(-12deg);
    pointer-events: none;
    transition: left 0.55s ease;
  }
  .hero-cta-primary:hover { transform: translateY(-2px); }
  .hero-cta-primary:hover::before { left: 130%; }
  .hero-cta-badge {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(30%, -50%);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #ec4899;
    color: #ffffff;
    font-family: 'Inter Tight', sans-serif;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    /* trim right padding to offset the trailing letter-spacing so the text reads centered */
    padding: 5px 8px 5px 9px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
    white-space: nowrap;
    pointer-events: none;
  }
  .hero-cta-badge svg { width: 11px; height: 11px; flex-shrink: 0; }
  /* Mobile: center the tag on the button and shrink to content (matches ServiceHero) */
  @media (max-width: 960px) {
    .hero-cta-badge { left: auto; right: 4%; transform: translate(0, -50%); padding: 5px 9px; }
  }
`;
