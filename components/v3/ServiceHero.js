
'use client';
import Form from './Form';

const HERO_BADGES = [
  { src: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/69498dcf9a206ed260446ac6_bbb-accredited-business-logo.webp', alt: 'BBB Accredited Business' },
  { src: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65ea3566667e1e282004fb81_Home%20Advisor%20Badge.svg', alt: 'HomeAdvisor' },
  { src: '/images/angi_logo.png', alt: 'Angi' },
  { src: '/images/thumbtack_logo.png', alt: 'Thumbtack' },
  { src: '/images/yelp_logo.png', alt: 'Yelp' },
  { src: '/images/facebook_logo.png', alt: 'Facebook' },
  { src: '/images/instagram_logo.png', alt: 'Instagram' },
  { src: '/images/houzz_logo.png', alt: 'Houzz' },
  { src: '/images/nextdoor_logo.png', alt: 'Nextdoor' },
];
// One half of the seamless marquee — the full badge set repeated so each half overflows the carousel width.
const HERO_BADGE_HALF = [...HERO_BADGES, ...HERO_BADGES];

export default function ServiceHero({ city, heading, serviceData }) {
  const heroImage = serviceData?.hero_image_url || 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da86840f464e36c79b_chimney-inspection-roofline-flue-evaluation.webp';
  const heroDescription = serviceData?.hero_description || 'Premium Chimneys provides professional fireplace and chimney services for your home. Our mission is to help you enjoy your fireplace safely and efficiently, with complete peace of mind.';
  const heroHeading = (serviceData?.h1 || heading || '').replace(/\{city\}/g, city.name);
  return (
    <>




      <style dangerouslySetInnerHTML={{__html: `
        .hero {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #ffffff;
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
          padding: 189px 24px 128px;
          display: flex;
          flex-direction: column;
          gap: 64px;
        }

        .hero-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
          gap: 48px;
          align-items: stretch;
        }

        .hero-media {
          position: relative;
          height: 100%;
          min-width: 0;
          padding: 8px;
          background: #F5F5F7;
          border: 1px solid #d2d2d7;
          border-radius: 24px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hero-side-video {
          width: 100%;
          min-width: 0;
          flex: 1;
          min-height: 420px;
          object-fit: cover;
          border-radius: 8px 8px 16px 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: none;
          display: block;
        }

        .hero-form-wrap {
          width: 100%;
          min-width: 0;
          max-width: 420px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hero-badge-carousel {
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
        }

        .hero-badge-track {
          display: flex;
          align-items: center;
          gap: 56px;
          width: max-content;
          animation: heroBadgeScroll 40s linear infinite;
        }

        .hero-badge-track:hover {
          animation-play-state: paused;
        }

        @keyframes heroBadgeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .hero-heading-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
        }

        /* In-container hero content is desktop-only; hidden by default so mobile is untouched */
        .hero-heading-inner {
          display: none;
        }

        /* Reviews widget replaces the location header on desktop only; hidden by default */
        .hero-media-reviews {
          display: none;
        }

        /* Video sits below the two hero panels on desktop only; hidden by default */
        .hero-under-video {
          display: none;
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
          height: 48px;
          width: auto;
          display: block;
          border-radius: 6px;
        }

        .hero-reviews {
          max-width: 280px;
          margin: 0 auto;
        }

        .hero-pill {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #7c3aed;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid #7c3aed;
          border-radius: 10px;
          padding: 8px;
          width: fit-content;
        }

        .hero-h1 {
          font-family: 'Inter Tight', sans-serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #000000;
          margin: 0;
          width: 100%;
          max-width: 100%;
          text-align: left;
        }

        .hero-desc {
          font-family: 'Inter Tight', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.65;
          color: #000000;
          margin: 0;
          width: 100%;
          max-width: 100%;
          text-align: left;
        }

        /* Location header sitting in the top of the media container */
        .hero-location {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 6px;
          font-family: 'Inter Tight', sans-serif;
        }

        .hero-location-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          line-height: 1.25;
        }

        .hero-location-title {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
        }

        .hero-location-area {
          font-size: 12px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.5);
        }

        .hero-location-pin {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: rgba(124, 58, 237, 0.9);
          color: #ffffff;
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
          justify-content: center;
          text-align: center;
          box-sizing: border-box;
        }

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
        @media (min-width: 961px) {
          .hero-h1, .hero-desc { width: 50%; align-self: center; text-align: center; color: #ffffff; }
          .hero-h1 { width: 60%; }
          /* Solid light hero background; the video moves below the two panels */
          .hero { background: #F5F5F7; }
          .hero-under-video {
            display: block;
            width: 100vw;
            margin-left: calc(50% - 50vw);
            height: 560px;
            object-fit: cover;
          }
          .hero-pill {
            align-self: center;
            color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          .hero-ctas { align-self: center; }
          .hero-cta-primary { width: auto; }

          /* Desktop: move hero content into the container, drop the top copy + side video */
          .hero-heading-top { display: none; }
          .hero-side-video { display: none; }
          .hero-heading-inner {
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: flex-start;
            text-align: left;
            gap: 20px;
            padding: 0;
          }
          .hero-heading-inner .hero-h1 {
            width: 100%;
            align-self: stretch;
            text-align: left;
            color: rgba(0, 0, 0, 0.85);
          }
          .hero-heading-inner .hero-desc {
            width: 100%;
            align-self: stretch;
            text-align: left;
            color: rgba(0, 0, 0, 0.6);
          }
          .hero-heading-inner .hero-pill {
            align-self: flex-start;
            color: rgba(0, 0, 0, 0.7);
            background: rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.12);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
          .hero-heading-inner .hero-ctas { align-self: flex-start; }

          /* Desktop: show the reviews widget, hide the mobile location header */
          .hero-media .hero-location { display: none; }
          .hero-media-reviews { display: block; }

          /* ─── White content panel, matched pair with the white form card ─── */
          .hero-media {
            background: #ffffff;
            border: none;
            border-radius: 20px;
            box-shadow: none;
            padding: 40px;
          }

          /* White form card (no shadow) */
          .hero .hero-form-card {
            background: #ffffff;
            border: none;
            box-shadow: none;
          }
          /* Generous 40px padding on all four outer edges of the form card */
          .hero .hero-form-top { padding: 40px 40px 0; }
          .hero .hero-form-body { padding: 20px 40px 40px; }

          /* Fields: white background, light-gray border, custom placeholder */
          .hero .hero-form-fields .hero-form-input,
          .hero .hero-form-fields .hero-form-textarea,
          .hero .hero-form-fields .hero-form-phone-wrap {
            background: #ffffff;
            border-color: #E5E7EB;
            border-radius: 12px;
          }
          .hero .hero-form-fields .hero-form-input::placeholder,
          .hero .hero-form-fields .hero-form-textarea::placeholder,
          .hero .hero-form-fields .hero-form-phone-input::placeholder {
            color: #8F9092;
          }
        }

        @media (max-width: 960px) {
          .hero-inner { gap: 24px; padding: 172px 24px 24px; }
          .hero-video, .hero-overlay { display: none; }
          .hero-row { grid-template-columns: 1fr; gap: 24px; }
          .hero-side-video { min-height: 240px; max-height: 340px; }
          .hero-h1 { font-size: 36px; max-width: 100%; }
          .hero-form-card { max-width: 480px; }
        }

        @media (max-width: 480px) {
          .hero-inner { padding: 172px 24px 24px; }
          .hero-h1 { font-size: 36px; width: 100%; }
          .hero-desc { max-width: 100%; width: 100%; }
          .hero-ctas { flex-direction: column; align-items: stretch; width: 100%; }
          .hero-cta-primary, .hero-cta-secondary { width: 100%; }
        }
      `}} />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-heading-group hero-heading-top">
            <span className="hero-pill">{heading}</span>
            <h1 className="hero-h1">{heroHeading}</h1>

            <p className="hero-desc">{heroDescription}</p>

            <div className="hero-ctas">
              <button type="button" className="hero-cta-primary" data-gateway-book>
                Book your free inspection
              </button>
            </div>
          </div>

          <div className="hero-row">
            <div className="hero-media">
              <div className="hero-media-reviews">
                <div className="elfsight-app-5b84b319-0dc0-446d-bab1-a30a175838f4" data-elfsight-app-lazy={true}></div>
              </div>
              <div className="hero-location">
                <span className="hero-location-pin">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>
                </span>
                <span className="hero-location-text">
                  <span className="hero-location-title">We're local to {city.name}</span>
                  <span className="hero-location-area">{city.service_area}</span>
                </span>
              </div>
              <div className="hero-heading-group hero-heading-inner">
                <span className="hero-pill">{heading}</span>
                <h1 className="hero-h1">{heroHeading}</h1>

                <p className="hero-desc">{heroDescription}</p>

                <div className="hero-ctas">
                  <button type="button" className="hero-cta-primary" data-gateway-book>
                    Book your free inspection
                  </button>
                </div>
              </div>
              <video className="hero-side-video" autoPlay muted loop playsInline>
                <source src="https://res.cloudinary.com/dnr8oynlg/video/upload/v1775893214/premium-chimneys-background-video_i1w9ta.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="hero-form-wrap">
              <Form />
            </div>
          </div>

          <video className="hero-under-video" autoPlay muted loop playsInline>
            <source src="https://res.cloudinary.com/dnr8oynlg/video/upload/v1775893214/premium-chimneys-background-video_i1w9ta.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
}
