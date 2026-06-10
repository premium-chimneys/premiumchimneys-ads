'use client';

/* Contained CTA banner that sits above the footer.
   Rounded dark-purple card aligned to the 1152px container (matches FormBanner),
   brand-purple shimmer heading + design-system primary/ghost buttons.
   Reuses the page's data-gateway-book hook. */

const PHONE_DISPLAY = '(214) 301-3711';
const PHONE_HREF = 'tel:+12143013711';

export default function FinalCTA() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&display=swap');

        /* ── Outer section: transparent so the dark portfolio backdrop shows ── */
        .fcta-section {
          background: transparent;
          padding: 80px 0 140px;
          font-family: 'Inter Tight', sans-serif;
        }

        /* ── Card: contained to the 1152px container with rounded edges ── */
        .fcta-card {
          position: relative;
          isolation: isolate;
          max-width: 1152px;
          width: calc(100% - 48px);
          margin: 0 auto;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(124, 58, 237, 0.15);
          background: linear-gradient(135deg, #1a1025 0%, #130d1e 50%, #1a1025 100%);
        }
        /* Soft purple focal glow rising from the bottom edge */
        .fcta-card::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -160px;
          transform: translateX(-50%);
          width: 720px;
          height: 360px;
          z-index: 0;
          background: radial-gradient(ellipse at center, rgba(124, 58, 237, 0.28), transparent 70%);
          filter: blur(20px);
          pointer-events: none;
        }

        /* Animated purple aurora line across the top edge */
        .fcta-aurora {
          position: relative;
          z-index: 1;
          height: 2px;
          width: 100%;
          background: linear-gradient(90deg, transparent, #7c3aed, #a78bfa, #c084fc, #a78bfa, #7c3aed, transparent);
          background-size: 300% 100%;
          animation: fctaLine 4s ease-in-out infinite;
        }
        @keyframes fctaLine { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

        .fcta-inner {
          position: relative;
          z-index: 1;
          max-width: 880px;
          margin: 0 auto;
          padding: 96px 24px;
          text-align: center;
        }

        /* ── Heading ── */
        .fcta-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin: 0;
        }
        .fcta-accent {
          background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: fctaShimmer 4s ease-in-out infinite;
        }
        @keyframes fctaShimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

        .fcta-sub {
          font-size: clamp(1rem, 1.6vw, 1.125rem);
          font-weight: 400;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.6);
          max-width: 560px;
          margin: 22px auto 0;
        }

        /* ── Buttons (design system) ── */
        .fcta-ctas {
          display: flex;
          justify-content: center;
          align-items: stretch;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 40px;
        }
        .fcta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          font-weight: 600;
          padding: 16px 28px;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.22s ease;
        }
        /* Primary — brand-purple gradient (matches the form's Submit button) */
        .fcta-btn-primary {
          position: relative;
          overflow: hidden;
          border: none;
          color: #ffffff;
          background: linear-gradient(160deg, #9b5de5 0%, #7c3aed 40%, #6d28d9 100%);
          text-shadow: 0 1px 2px rgba(45, 15, 80, 0.35);
        }
        .fcta-btn-primary::before {
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
        .fcta-btn-primary:hover { transform: translateY(-2px); }
        .fcta-btn-primary:hover::before { left: 130%; }

        /* Secondary — ghost/outline on dark */
        .fcta-btn-ghost {
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.04);
        }
        .fcta-btn-ghost:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .fcta-section { padding: 0; }
          .fcta-card { width: 100%; border-radius: 0; border-left: none; border-right: none; }
          .fcta-inner { padding: 64px 20px; }
          .fcta-ctas { flex-direction: column; gap: 12px; }
          .fcta-btn { width: 100%; }
        }
      `}} />

      <section className="fcta-section">
        <div className="fcta-card">
          <div className="fcta-aurora" />
          <div className="fcta-inner">
            <h2 className="fcta-title">
              Your fireplace is hiding a <span className="fcta-accent">fire hazard.</span>
            </h2>
            <p className="fcta-sub">
              One sweep clears the creosote, restores airflow, and makes it safe to light again.
            </p>

            <div className="fcta-ctas">
              <button type="button" className="fcta-btn fcta-btn-primary" data-gateway-book>
                Book my free inspection
              </button>
              <a href={PHONE_HREF} className="fcta-btn fcta-btn-ghost">
                Or call us — {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
