'use client';

import Reviews from '@/components/v2/Reviews'
import FinalCTA from '@/components/v2/FinalCTA'

/* ── Portfolio (section 3) ──────────────────────────────────────────────────
   Dark, spacious section with ambient orbs. Holds the bento gallery, then the
   reviews block, then the CTA banner. Reviews + FinalCTA render with transparent
   backgrounds so this section's dark backdrop shows through behind them. */

export default function Portfolio({ city }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <section className="pf-section" id="portfolio">
        <div className="pf-bg" aria-hidden="true" />
        <div className="pf-grid" aria-hidden="true" />

        <div className="pf-content">
          {/* ── Gallery ── */}
          <div className="pf-inner">
            <div className="gal-head">
              <h2 className="gal-title">Take a look at some of our recent work</h2>
            </div>
            {/* TODO: replace gray tiles with real Premium Chimneys job photos */}
            <div className="gal-bento">
              <div className="gal-tile gal-t1" aria-hidden="true" />
              <div className="gal-tile gal-t2" aria-hidden="true" />
              <div className="gal-tile gal-t3" aria-hidden="true" />
              <div className="gal-tile gal-t4" aria-hidden="true" />
              <div className="gal-tile gal-t5" aria-hidden="true" />
              <div className="gal-tile gal-t6" aria-hidden="true" />
            </div>
          </div>

          {/* ── Reviews ── */}
          <Reviews city={city} />

          {/* ── CTA banner ── */}
          <FinalCTA />
        </div>
      </section>
    </>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap');

  .pf-section {
    position: relative;
    overflow: hidden;
    background: #06030c;
    font-family: 'Inter Tight', sans-serif;
  }
  .pf-bg {
    position: absolute; inset: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 90% 18% at 50% 0%, rgba(124,58,237,0.22), transparent 70%),
      radial-gradient(circle 720px at 12% 14%, rgba(192,132,252,0.12), transparent 70%),
      radial-gradient(circle 720px at 88% 20%, rgba(251,113,133,0.08), transparent 70%),
      radial-gradient(circle 820px at 16% 52%, rgba(124,58,237,0.16), transparent 65%),
      radial-gradient(circle 820px at 84% 60%, rgba(245,158,11,0.11), transparent 65%),
      radial-gradient(circle 760px at 50% 96%, rgba(124,58,237,0.15), transparent 70%);
  }
  .pf-grid {
    position: absolute; inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(167,139,250,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(167,139,250,0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 35%, transparent 100%);
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 35%, transparent 100%);
  }
  .pf-content { position: relative; z-index: 1; }

  /* ── Gallery (bento) — dark ── */
  .pf-inner { max-width: 1200px; margin: 0 auto; padding: 140px 24px 0; }
  .gal-head { text-align: center; margin-bottom: 40px; }
  .gal-title {
    margin: 0;
    font-size: 48px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #ffffff;
  }
  .gal-bento {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 300px;
    gap: 16px;
  }
  .gal-tile {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 16px;
  }
  .gal-t1 { grid-column: span 2; }  /* row 1: 2/3 */
  .gal-t2 { grid-column: span 1; }  /* row 1: 1/3 */
  .gal-t3 { grid-column: span 3; }  /* row 2: full width */
  .gal-t4 { grid-column: span 1; }  /* row 3: thirds */
  .gal-t5 { grid-column: span 1; }
  .gal-t6 { grid-column: span 1; }

  @media (max-width: 960px) {
    .pf-inner { padding: 96px 20px 0; }
    .gal-title { font-size: 36px; }
    .gal-bento { grid-auto-rows: 180px; gap: 12px; }
  }
  @media (max-width: 560px) {
    .gal-bento { grid-template-columns: 1fr; grid-auto-rows: 200px; }
    .gal-tile { grid-column: auto; }
  }
`;
