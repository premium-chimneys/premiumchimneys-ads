
'use client';
import { useEffect } from 'react';
import { getCalendlyUrl } from '@/lib/useCalendlyTracking';
import Form from './Form';

export default function ServiceHero({ city, heading }) {
  useEffect(() => {
    // ---- script block ----
    try {
      (function() {
        // ─── Calendly button ─────────────────────────────────────────────────────────
        // Uses initPopupWidget so the GCLID/MSCLKID intercept in the footer fires correctly
        var heroCalBtn = document.getElementById('heroOpenCalendly');

        function openCalendly() {
          if (window.Calendly) {
            Calendly.initPopupWidget({ url: getCalendlyUrl('https://calendly.com/premiumchimneys/inspection') });
          }
        }

        if (heroCalBtn) {
          heroCalBtn.addEventListener('click', function() {
            if (window.Calendly) {
              openCalendly();
            } else {
              // Calendly script hasn't loaded yet — wait for it
              var check = setInterval(function() {
                if (window.Calendly) {
                  clearInterval(check);
                  openCalendly();
                }
              }, 100);
            }
          });
        }

      })();
    } catch (e) { console.error('[component script]', e); }
  }, []);
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
        <img className="hero-video" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da86840f464e36c79b_chimney-inspection-roofline-flue-evaluation.webp" alt="" />
        <div className="hero-overlay"></div>

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badges">
              <img className="hero-badge-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/69498dcf9a206ed260446ac6_bbb-accredited-business-logo.webp" alt="BBB Accredited Business" />
              <img className="hero-badge-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65ea3566667e1e282004fb81_Home%20Advisor%20Badge.svg" alt="HomeAdvisor" />
              <div className="hero-reviews">
                <div className="elfsight-app-5b84b319-0dc0-446d-bab1-a30a175838f4" data-elfsight-app-lazy={true}></div>
              </div>
            </div>

            <h1 className="hero-h1"><span style={{ display: 'block' }}>{heading.replace(` in ${city.name}`, '')}</span><span style={{ display: 'block' }}>{`in ${city.name}`}</span></h1>

            <p className="hero-desc">Premium Chimneys provides professional fireplace and chimney services for your home. Our mission is to help you enjoy your fireplace safely and efficiently, with complete peace of mind.</p>

            <div className="hero-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>
              {city.service_area}
            </div>

            <div className="hero-ctas">
              <button type="button" className="hero-cta-primary" id="heroOpenCalendly">
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
