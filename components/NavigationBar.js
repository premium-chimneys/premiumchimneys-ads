
'use client';
import { useEffect } from 'react';
import { getCalendlyUrl } from '@/lib/useCalendlyTracking';

const svgProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  style: { position: 'relative', zIndex: 1, filter: 'drop-shadow(0 1px 1px rgba(45, 15, 80, 0.35))' },
};

const services = [
  {
    slug: 'chimney-inspection',
    name: 'Chimney Inspection',
    sub: 'Safety reports & evaluations',
    icon: (
      <svg {...svgProps}>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    slug: 'chimney-sweep',
    name: 'Chimney Sweep',
    sub: 'Deep cleaning, top to bottom',
    icon: (
      <svg {...svgProps}>
        <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
        <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.21 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
      </svg>
    ),
  },
  {
    slug: 'chimney-repair',
    name: 'Chimney Repair',
    sub: 'Fix cracks, leaks & damage',
    icon: (
      <svg {...svgProps}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    slug: 'chimney-caps',
    name: 'Chimney Caps',
    sub: 'Protection from weather & pests',
    icon: (
      <svg {...svgProps}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    slug: 'fireplace-inspection',
    name: 'Fireplace Inspection',
    sub: 'Full system checkup',
    icon: (
      <svg {...svgProps}>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    slug: 'fireplace-cleaning',
    name: 'Fireplace Cleaning',
    sub: 'Remove soot & buildup',
    icon: (
      <svg {...svgProps}>
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
        <path d="M19 15l.6 1.6L21 17l-1.4.4L19 19l-.6-1.6L17 17l1.4-.4z" />
      </svg>
    ),
  },
  {
    slug: 'fireplace-repair',
    name: 'Fireplace Repair',
    sub: 'Restore full functionality',
    icon: (
      <svg {...svgProps}>
        <path d="M14 9l7 7-2 2-7-7" />
        <path d="M9 14l-6 6 2 2 6-6" />
        <path d="M14 9l-5-5-3 3 5 5" />
      </svg>
    ),
  },
  {
    slug: 'fireplace-maintenance',
    name: 'Fireplace Maintenance',
    sub: 'Ensure your system is safe and efficient',
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    slug: 'gas-fireplace-repair',
    name: 'Gas Fireplace Repair',
    sub: 'Expert gas system fixes',
    icon: (
      <svg {...svgProps}>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.72-3.45-.87-6.65 2-9 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
];

export default function NavigationBar({ city }) {
  useEffect(() => {
    // ---- script block ----
    try {
      (function() {
        var nav = document.getElementById('navWrapper');
        if (nav) {
          window.addEventListener('scroll', function() {
            if (window.scrollY > 8) {
              nav.classList.add('scrolled');
            } else {
              nav.classList.remove('scrolled');
            }
          }, { passive: true });
        }
      
        var openBtn = document.getElementById('openCalendly');
        if (openBtn) {
          openBtn.addEventListener('click', function() {
            var url = getCalendlyUrl('https://calendly.com/premiumchimneys/inspection');
            function open() { if (window.Calendly) window.Calendly.initPopupWidget({ url: url }); }
            if (window.Calendly) { open(); }
            else {
              var t = setInterval(function() { if (window.Calendly) { clearInterval(t); open(); } }, 100);
            }
          });
        }
      })();
    } catch (e) { console.error('[component script]', e); }
  }, []);
  return (
    <>

      <style dangerouslySetInnerHTML={{__html: `
        .nav-wrapper {
          position: fixed;
          top: 44px;
          left: 0;
          width: 100%;
          z-index: 999;
          background: rgba(255, 255, 255, 0.96);
          transition: background 0.3s ease, backdrop-filter 0.3s ease;
        }
      
        .nav-wrapper.scrolled {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Inter Tight', sans-serif;
        }
      
        .nav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }
      
        .nav-logo img {
          height: 37px;
          width: auto;
          display: block;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 36px;
          font-family: 'Inter Tight', sans-serif;
          margin-left: 48px;
          margin-right: auto;
        }

        .nav-link {
          position: relative;
          font-size: 14px;
          font-weight: 500;
          color: #000000;
          text-decoration: none;
          letter-spacing: 0.01em;
          white-space: nowrap;
          transition: color 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 0;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: -8px;
          bottom: -8px;
          left: -14px;
          right: -14px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(124, 58, 237, 0.14);
          opacity: 0;
          transform: scale(0.88);
          transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: -1;
        }

        .nav-link:hover {
          color: #5b21b6;
        }

        .nav-link:hover::before {
          opacity: 1;
          transform: scale(1);
        }

        @media (max-width: 960px) {
          .nav-links { display: none; }
        }

        /* Services dropdown */
        .nav-services-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .nav-link-services {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .nav-caret {
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }

        .nav-services-wrapper:hover .nav-caret,
        .nav-services-wrapper:focus-within .nav-caret {
          transform: rotate(180deg);
        }

        .nav-services-dropdown {
          position: absolute;
          top: calc(100% + 14px);
          left: 50%;
          min-width: 340px;
          padding: 10px;
          background: #ffffff;
          border: 1px solid rgba(26, 18, 37, 0.06);
          border-radius: 18px;
          box-shadow:
            0 32px 80px rgba(91, 33, 182, 0.18),
            0 12px 32px rgba(26, 18, 37, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translate(-50%, 8px);
          transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-services-dropdown::before {
          content: '';
          position: absolute;
          top: -18px;
          left: 0;
          right: 0;
          height: 18px;
        }

        .nav-services-wrapper:hover .nav-services-dropdown,
        .nav-services-wrapper:focus-within .nav-services-dropdown {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translate(-50%, 0);
        }

        .nav-service-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.18s ease, transform 0.18s ease;
        }

        .nav-service-item:hover {
          background: rgba(26, 18, 37, 0.05);
        }

        .nav-service-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background:
            radial-gradient(circle at 30% 25%, rgba(167,139,250,0.35) 0%, transparent 55%),
            radial-gradient(circle at 75% 80%, rgba(124,58,237,0.28) 0%, transparent 60%),
            linear-gradient(160deg, #0e0b14 0%, #1a1030 45%, #241548 100%);
          border: 1px solid rgba(124, 58, 237, 0.35);
          box-shadow:
            inset 0 1px 0 rgba(167, 139, 250, 0.15),
            0 0 18px rgba(124, 58, 237, 0.22),
            0 4px 12px rgba(14, 11, 20, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #e0d4fc;
        }

        .nav-service-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .nav-service-name {
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #000;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        .nav-service-sub {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: #6b6080;
          line-height: 1.3;
          margin-top: 2px;
        }

        .nav-ctas {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
      
        .nav-phone {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #4a3870;
          text-decoration: none;
          padding: 8px 16px 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(124, 58, 237, 0.28);
          background: transparent;
          letter-spacing: 0.01em;
          transition: all 0.2s ease;
          white-space: nowrap;
          cursor: pointer;
        }
      
        .nav-phone:hover {
          color: #2a1e42;
          border-color: rgba(124, 58, 237, 0.45);
          background: rgba(124, 58, 237, 0.04);
        }
      
        .nav-apply {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #f0e0fd;
          text-decoration: none;
          padding: 8px 18px 8px 14px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(
            160deg,
            #9b5de5 0%,
            #7c3aed 25%,
            #5b21b6 50%,
            #6d28d9 72%,
            #8b5cf6 100%
          );
          border: 1px solid #7c3aed;
          box-shadow:
            inset 0 1px 0 rgba(196, 155, 240, 0.55),
            inset 0 -1px 0 rgba(0, 0, 0, 0.22),
            0 2px 10px rgba(91, 33, 182, 0.45);
          letter-spacing: 0.01em;
          transition: all 0.22s ease;
          white-space: nowrap;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          text-shadow: 0 1px 2px rgba(45, 15, 80, 0.35);
        }
      
        .nav-apply::before {
          content: '';
          position: absolute;
          top: 0;
          left: -70%;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            105deg,
            transparent 35%,
            rgba(210, 175, 255, 0.38) 50%,
            transparent 65%
          );
          transform: skewX(-12deg);
          pointer-events: none;
          transition: left 0.55s ease;
        }
      
        .nav-apply:hover {
          transform: translateY(-1px);
          box-shadow:
            inset 0 1px 0 rgba(196, 155, 240, 0.55),
            inset 0 -1px 0 rgba(0, 0, 0, 0.22),
            0 5px 18px rgba(91, 33, 182, 0.5);
          border-color: #8b5cf6;
        }
      
        .nav-apply:hover::before {
          left: 130%;
        }
      
        .nav-apply:active {
          transform: translateY(0);
          box-shadow:
            inset 0 1px 0 rgba(196, 155, 240, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.22),
            0 2px 6px rgba(91, 33, 182, 0.3);
        }
      
        .nav-separator {
          width: 100%;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(74, 56, 112, 0.12) 15%,
            rgba(74, 56, 112, 0.12) 85%,
            transparent
          );
        }
      
        @media (max-width: 760px) {
          .nav-phone { display: none; }
          .nav-inner { padding: 0 20px; }
        }
      `}} />
      
      <nav className="nav-wrapper" id="navWrapper">
        <div className="nav-inner">
      
          {/* Logo */}
          <a href={`/homepage/${city?.slug ?? ''}`} className="nav-logo">
            <img src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65e2c8c7fdd2f9e01030c70f_Premium%20Chimneys%20(Dark).svg" alt="Premium Chimneys" />
          </a>

          {/* Nav links */}
          <div className="nav-links">
            <a href={`/homepage/${city?.slug ?? ''}`} className="nav-link">Home</a>
            <a href={`/about/${city?.slug ?? ''}`} className="nav-link">About</a>
            <div className="nav-services-wrapper">
              <a href="/services" className="nav-link nav-link-services">
                Services
                <svg className="nav-caret" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </a>
              <div className="nav-services-dropdown">
                {services.map((s) => (
                  <a
                    key={s.slug}
                    href={`/${s.slug}/${city?.slug ?? ''}`}
                    className="nav-service-item"
                  >
                    <div className="nav-service-icon">{s.icon}</div>
                    <div className="nav-service-text">
                      <span className="nav-service-name">{s.name}</span>
                      <span className="nav-service-sub">{s.sub}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            {city?.metroplex === 'dfw' && (
              <a href={`/membership/${city?.slug ?? ''}`} className="nav-link">Membership</a>
            )}
            <a href={`/blog/${city?.slug ?? ''}`} className="nav-link">Blog</a>
            <a href={`/contact/${city?.slug ?? ''}`} className="nav-link">Contact</a>
          </div>

          {/* CTAs */}
          <div className="nav-ctas">
            <a href={`tel:${city.phone}`} className="nav-phone">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>{`
              ${city.phone_text}
            `}</a>
            <button type="button" className="nav-apply" id="openCalendly">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              Book Appointment
            </button>
          </div>
      
        </div>
      
        {/* Separator */}
        <div className="nav-separator"></div>
      </nav>
    </>
  );
}
