
import Form from './Form';
import GoogleReviewsPill from './GoogleReviewsPill';

export default function ServiceHero({ city, heading, serviceData }) {
  const heroImage = serviceData?.hero_image_url || 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da86840f464e36c79b_chimney-inspection-roofline-flue-evaluation.webp';
  // The hero image is the LCP element and sits on another origin, so warm that
  // connection up — React emits the preload itself (taking fetchPriority and
  // srcSet off the <img>) but never the preconnect.
  let heroOrigin = null;
  try { heroOrigin = new URL(heroImage).origin; } catch { /* relative URL — same origin */ }

  // A phone paints this about 390 CSS px wide, so the full-width file is far
  // more pixels than it can use. Every `-hero-opt.webp` in the bucket has an
  // 860px sibling; matching on that suffix means a services row pointing
  // anywhere else just keeps the single image rather than requesting a variant
  // that was never uploaded.
  const heroSmall = /-hero-opt\.webp$/.test(heroImage)
    ? heroImage.replace(/-hero-opt\.webp$/, '-hero-opt-860.webp')
    : null;
  const heroSrcSet = heroSmall ? `${heroSmall} 860w, ${heroImage} 1724w` : undefined;
  const heroSizes = heroSmall ? '100vw' : undefined;
  const heroDescription = serviceData?.hero_description || 'Premium Chimneys provides professional fireplace and chimney services for your home. Our mission is to help you enjoy your fireplace safely and efficiently, with complete peace of mind.';
  return (
    <>
      {heroOrigin && <link rel="preconnect" href={heroOrigin} crossOrigin="anonymous" />}

      <style dangerouslySetInnerHTML={{__html: `
        .hero {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1;
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 237px 24px 128px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 60px;
          align-items: center;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .hero-badges {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-badge-img {
          height: 72px;
          width: auto;
          display: block;
          border-radius: 6px;
        }

        .hero-reviews {
          max-width: 280px;
        }

        .hero-h1 {
          font-family: 'Inter Tight', sans-serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin: 0;
          max-width: 100%;
          white-space: nowrap;
        }

        .hero-desc {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          max-width: 440px;
        }

        .hero-location {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.55);
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          padding: 8px 16px 8px 12px;
          width: fit-content;
        }

        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-cta-primary,
        .hero-cta-secondary {
          width: 210px;
          height: 46px;
          justify-content: center;
          text-align: center;
          box-sizing: border-box;
        }

        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #f0e0fd;
          text-decoration: none;
          padding: 12px 24px;
          border: 1px solid #7c3aed;
          border-radius: 10px;
          background: linear-gradient(160deg, #9b5de5 0%, #7c3aed 25%, #5b21b6 50%, #6d28d9 72%, #8b5cf6 100%);
          box-shadow: inset 0 1px 0 rgba(196,155,240,0.55), inset 0 -1px 0 rgba(0,0,0,0.22), 0 4px 16px rgba(91,33,182,0.45);
          cursor: pointer;
          transition: all 0.22s ease;
          position: relative;
          overflow: hidden;
          text-shadow: 0 1px 2px rgba(45,15,80,0.35);
        }

        .hero-cta-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -70%;
          width: 40%;
          height: 100%;
          background: linear-gradient(105deg, transparent 35%, rgba(210,175,255,0.35) 50%, transparent 65%);
          transform: skewX(-12deg);
          pointer-events: none;
          transition: left 0.55s ease;
        }

        .hero-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(196,155,240,0.55), inset 0 -1px 0 rgba(0,0,0,0.22), 0 8px 24px rgba(91,33,182,0.5);
        }

        .hero-cta-primary:hover::before { left: 130%; }

        .hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hero-cta-secondary:hover {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
          color: #ffffff;
        }

        .hero-reviews [class*="elfsight-app-"],
        .hero-reviews [class*="elfsight-app-"] * {
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }


        /* ─── RESPONSIVE ─────────────────────────────────────── */
        @media (max-width: 960px) {
          .hero-inner { grid-template-columns: 1fr; gap: 40px; padding: 189px 24px 80px; }
          .hero-h1 { font-size: 38px; max-width: 100%; }
          .hero-form-card { max-width: 480px; }
        }

        @media (max-width: 480px) {
          .hero-inner { padding: 189px 24px 80px; }
          .hero-h1 { font-size: 30px; }
          .hero-ctas { flex-direction: column; align-items: stretch; }
          .hero-cta-primary, .hero-cta-secondary { width: 100%; }
        }
      `}} />

      <section className="hero">
        <img
          className="hero-video"
          src={heroImage}
          srcSet={heroSrcSet}
          sizes={heroSizes}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          alt=""
        />
        <div className="hero-overlay"></div>

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badges">
              <img className="hero-badge-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/69498dcf9a206ed260446ac6_bbb-accredited-business-logo.webp" alt="BBB Accredited Business" />
              {/* Was a 50 KB-over-the-wire "SVG" wrapping 21 base64 rasters.
                  This is the same artwork flattened to 8 KB, at 3x the 72px it
                  renders at. It stays eager: it is in the hero. */}
              <img className="hero-badge-img" src="/images/homeadvisor_badge-216.webp" alt="HomeAdvisor" />
              {/* Was the raw Elfsight widget. Because it was the hero's only
                  reviews content, it had to load during the initial render —
                  526 KB of third-party JS on the critical path. The pill paints
                  the same information instantly and keeps the real widget
                  underneath for the click, so Elfsight can now be deferred. */}
              <div className="hero-reviews">
                <GoogleReviewsPill />
              </div>
            </div>

            <h1 className="hero-h1"><span style={{ display: 'block' }}>{heading.replace(` in ${city.name}`, '')}</span><span style={{ display: 'block' }}>{`in ${city.name}`}</span></h1>

            <p className="hero-desc">{heroDescription}</p>

            <div className="hero-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>
              {city.service_area}
            </div>

            <div className="hero-ctas">
              <button type="button" className="hero-cta-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8" /></svg>
                Book Appointment
              </button>
              <a href={`tel:${city.phone}`} className="hero-cta-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>{`
                ${city.phone_text}
              `}</a>
            </div>
          </div>

          <Form />
        </div>
      </section>
    </>
  );
}
