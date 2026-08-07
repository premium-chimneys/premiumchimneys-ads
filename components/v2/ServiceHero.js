
'use client';
import Form from './Form';
import GoogleReviewsPill from './GoogleReviewsPill';

export default function ServiceHero({ city, heading, serviceData }) {
  const heroImage = serviceData?.hero_image_url || 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da86840f464e36c79b_chimney-inspection-roofline-flue-evaluation.webp';
  const heroDescription = serviceData?.hero_description || 'Premium Chimneys provides professional fireplace and chimney services for your home. Our mission is to help you enjoy your fireplace safely and efficiently, with complete peace of mind.';
  const cityName = city.name.split(',')[0].trim();
  // Possessive: names ending in "s" take just an apostrophe (Dallas' not Dallas's).
  const cityPossessive = /s$/i.test(cityName) ? `${cityName}'` : `${cityName}'s`;
  const serviceName = heading.replace(` in ${city.name}`, '');
  // The hero image is the LCP element and lives on another origin, so the
  // browser would otherwise pay a cold DNS+TCP+TLS handshake before its first
  // byte. React already emits the <link rel="preload"> for it (picking up the
  // fetchPriority and srcSet from the <img> below), but it does not preconnect,
  // so that hint is ours to add — hoisted into <head>, ahead of the <img>.
  // Derived from the URL rather than hardcoded: the image comes from the
  // v2_hero_images table, so the host can change without touching this file.
  let heroOrigin = null;
  try { heroOrigin = new URL(heroImage).origin; } catch { /* relative URL — same origin, no preconnect needed */ }

  // A phone shows the hero about 390 CSS px wide, so the 1724px file is roughly
  // double the pixels it can use. Every `-v2.webp` in the bucket has an 860px
  // sibling uploaded alongside it; match on that suffix so a row pointing
  // anywhere else simply gets no srcset and keeps the single full-size image
  // rather than requesting a variant that was never uploaded.
  const heroSmall = /-v2\.webp$/.test(heroImage)
    ? heroImage.replace(/-v2\.webp$/, '-v2-860.webp')
    : null;
  const heroSrcSet = heroSmall ? `${heroSmall} 860w, ${heroImage} 1724w` : undefined;
  // The hero is full-bleed at every breakpoint.
  const heroSizes = heroSmall ? '100vw' : undefined;
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
          /* Start below the fixed announcement bar (44px) + nav (~84px) so the
             hero never sits underneath them. */
          margin-top: 128px;
        }

        .hero-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          z-index: 0;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          /* Cinematic corner scrim: dark down the left and along the bottom,
             fading to reveal the image toward the top-right. */
          background:
            linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.66) 36%, rgba(0, 0, 0, 0.25) 60%, rgba(0, 0, 0, 0.08) 78%, rgba(0, 0, 0, 0) 88%),
            linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.32) 28%, rgba(0, 0, 0, 0) 57%),
            rgba(0, 0, 0, 0.15);
          z-index: 1;
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 24px 128px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 44px;
          align-items: center;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .hero-location-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: nowrap;
        }


        .hero-h1 {
          font-family: 'Inter Tight', sans-serif;
          font-size: 64px;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin: 0;
          max-width: 100%;
          white-space: normal;
        }

        .hero-desc {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.65;
          color: #ffffff;
          margin: 0;
          max-width: 440px;
        }

        .hero-location {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          font-family: 'Inter Tight', sans-serif;
          background: #ffffff;
          border: 1px solid rgba(124, 58, 237, 0.22);
          border-radius: 12px;
          padding: 9px 14px 9px 9px;
          width: fit-content;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .hero-location-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          border-radius: 10px;
          color: #ffffff;
          background: linear-gradient(160deg, #9b5de5 0%, #7c3aed 50%, #5b21b6 100%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.30), 0 3px 10px rgba(91, 33, 182, 0.38);
        }

        .hero-location-divider {
          width: 1px;
          align-self: stretch;
          background: linear-gradient(to bottom, transparent, rgba(124, 58, 237, 0.20), transparent);
        }

        .hero-location-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .hero-location-eyebrow {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          line-height: 1.1;
          color: #7c3aed;
        }

        .hero-location-address {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.25;
          color: #2a1e42;
          white-space: nowrap;
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
          font-size: 16px;
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
          font-size: 16px;
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


        @keyframes heroShimmerText { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .hero-city-accent {
          background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: heroShimmerText 4s ease-in-out infinite;
        }

        /* ─── RESPONSIVE ─────────────────────────────────────── */
        @media (max-width: 960px) {
          .hero { margin-top: 0; background: #14101e; }
          /* Landscape band at the top instead of a full-height cover (which
             over-zooms on a tall screen). Fades into the dark background; the
             base left+bottom gradient overlay carries over from desktop. */
          .hero-video {
            top: 100px;
            height: 58vh;
            bottom: auto;
            object-position: 40% 14%;
            -webkit-mask-image: linear-gradient(to bottom, #000 72%, transparent 100%);
            mask-image: linear-gradient(to bottom, #000 72%, transparent 100%);
          }
          .hero-location-row { flex-wrap: wrap; }
          .hero-inner { grid-template-columns: 1fr; gap: 40px; padding: 150px 24px 80px; }
          .hero-h1 { font-size: 48px; max-width: 100%; }
          .hero-form-card { max-width: 480px; }
          .hero-location-address { white-space: normal; max-width: 300px; }
        }

        @media (max-width: 480px) {
          .hero-inner { padding: 150px 24px 80px; }
          .hero-h1 { font-size: 48px; }
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
            <div className="hero-location-row">
              <div className="hero-location">
                <span className="hero-location-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>
                </span>
                <span className="hero-location-divider" aria-hidden="true"></span>
                <span className="hero-location-text">
                  <span className="hero-location-eyebrow">{`SERVING ${cityName} & NEARBY COMMUNITIES`}</span>
                  <span className="hero-location-address">{city.service_area}</span>
                </span>
              </div>
              <GoogleReviewsPill />
            </div>

            <h1 className="hero-h1">{`${cityPossessive} Trusted Local ${serviceName}`}</h1>

            <p className="hero-desc">{heroDescription}</p>

            <div className="hero-ctas">
              <button type="button" className="hero-cta-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8" /></svg>
                Schedule Online
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
