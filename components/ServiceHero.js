
import Form from './Form';
import GoogleReviewsPill, { ELF_CLASS } from './GoogleReviewsPill';
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, GOOGLE_REVIEWS_URL } from '@/lib/credentials';

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

        /* Top-aligned so the two buttons stay level even though only the
           primary slot carries a note underneath. The top padding is the room
           the badges poke up into, so they never crowd the paragraph above; the
           row gap is the same room again should the buttons wrap. */
        .hero-ctas {
          display: flex;
          align-items: flex-start;
          gap: 26px 14px;
          flex-wrap: wrap;
          padding-top: 8px;
        }

        /* Each button sits in a slot that the badge hangs off. The badge can't
           live inside the button: the primary clips its own overflow for the
           shine sweep, which would cut the badge in half. */
        .hero-cta-slot {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        /* One badge, two colourways. Same height, type, padding and overlap on
           both buttons; only the palette changes. It overlaps the button's top
           border by half its own height (24px / 2), and ignores the pointer so
           a click on it lands on the button underneath. */
        .hero-cta-badge {
          position: absolute;
          top: -12px;
          right: 12px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 24px;
          padding: 0 9px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0.01em;
          white-space: nowrap;
          border: 1px solid;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.22);
          pointer-events: none;
          transition: transform 0.22s ease;
        }

        .hero-cta-badge-rating {
          color: #352a16;
          background: #fff8e7;
          border-color: rgba(166, 107, 0, 0.35);
        }

        .hero-cta-badge-star { color: #a66b00; font-size: 12px; }

        .hero-cta-badge-open {
          color: #166534;
          background: #ecfdf5;
          border-color: rgba(22, 101, 52, 0.28);
        }

        .hero-cta-badge-dot {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #16a34a;
        }

        /* The primary lifts 2px on hover; its badge rides along so it still
           looks attached rather than left behind. */
        .hero-cta-slot:has(.hero-cta-primary:hover) .hero-cta-badge { transform: translateY(-2px); }

        .hero-cta-note {
          margin: 8px 0 0;
          font-family: 'Inter Tight', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          line-height: 1.3;
          letter-spacing: 0.01em;
          text-align: center;
          color: rgba(255, 255, 255, 0.72);
        }

        .hero-cta-note a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: underline;
          text-decoration-color: rgba(255, 255, 255, 0.35);
          text-underline-offset: 3px;
          transition: color 0.2s ease, text-decoration-color 0.2s ease;
        }

        .hero-cta-note a:hover,
        .hero-cta-reviews:hover a { color: #ffffff; text-decoration-color: rgba(255, 255, 255, 0.8); }

        .hero-cta-reviews { position: relative; display: inline-block; }

        /* The invisible widget, padded a little past the link so the whole
           phrase is an easy target, and clipped to that box. */
        .hero-cta-reviews-elf {
          position: absolute;
          inset: -4px -6px;
          z-index: 1;
          opacity: 0;
          overflow: hidden;
          cursor: pointer;
        }

        .hero-cta-reviews-elf > div { width: 100%; height: 100%; }

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
          box-shadow: inset 0 1px 0 rgba(196,155,240,0.55), inset 0 -1px 0 rgba(0,0,0,0.22), 0 3px 12px rgba(91,33,182,0.32);
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
          box-shadow: inset 0 1px 0 rgba(196,155,240,0.55), inset 0 -1px 0 rgba(0,0,0,0.22), 0 6px 18px rgba(91,33,182,0.4);
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
          /* Stacked, the 26px row gap still clears the note under the primary
             plus the half-badge poking up from the phone button. */
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
              <img className="hero-badge-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/69498dcf9a206ed260446ac6_bbb-accredited-business-logo.webp" alt="BBB Accredited Business" width="61" height="101" />
              {/* Was a 50 KB-over-the-wire "SVG" wrapping 21 base64 rasters.
                  This is the same artwork flattened to 8 KB, at 3x the 72px it
                  renders at. It stays eager: it is in the hero. */}
              {/* Intrinsic size, so the browser can work out the box from the
                  aspect ratio instead of waiting for the file to arrive. The
                  CSS (height 72px, width auto) still decides how big it draws. */}
              <img className="hero-badge-img" src="/images/homeadvisor_badge-216.webp" alt="HomeAdvisor" width="239" height="216" />
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
              <div className="hero-cta-slot">
                <button type="button" className="hero-cta-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8" /></svg>
                  Book Appointment
                </button>
                <span className="hero-cta-badge hero-cta-badge-rating">
                  <span className="hero-cta-badge-star" aria-hidden="true">★</span>
                  {`${GOOGLE_RATING} on Google`}
                </span>
                <div className="hero-cta-note">
                  {/* Same trick as the reviews pill: the real Elfsight widget
                      sits invisibly over the link, so a click opens the same
                      popup the pill does. The link underneath is what keyboard
                      and screen-reader users get, straight to Google. */}
                  <div className="hero-cta-reviews">
                    <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">{`${GOOGLE_REVIEW_COUNT} Google reviews`}</a>
                    <div className="hero-cta-reviews-elf" aria-hidden="true">
                      <div className={ELF_CLASS} data-elfsight-app-lazy={true}></div>
                    </div>
                  </div>
                  {' · Insured & Bonded'}
                </div>
              </div>
              <div className="hero-cta-slot">
                <a href={`tel:${city.phone}`} className="hero-cta-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>{`
                  ${city.phone_text}
                `}</a>
                <span className="hero-cta-badge hero-cta-badge-open">
                  <span className="hero-cta-badge-dot" aria-hidden="true"></span>
                  Open now
                </span>
              </div>
            </div>
          </div>

          <Form />
        </div>
      </section>
    </>
  );
}
