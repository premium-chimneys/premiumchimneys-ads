
'use client';
import { useEffect } from 'react';

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
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Inter Tight', sans-serif;
        }

        .nav-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #4a3870;
          letter-spacing: 0.01em;
          white-space: nowrap;
          pointer-events: none;
        }

        .nav-center strong {
          font-weight: 700;
          color: #2a1e42;
        }

        .nav-star {
          color: #f5a623;
          vertical-align: -2px;
          margin-right: 4px;
        }

        @media (max-width: 900px) {
          .nav-inner {
            flex-wrap: wrap;
            height: auto;
            padding-top: 10px;
            padding-bottom: 0;
          }
          .nav-center {
            order: 3;
            position: static;
            transform: none;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: normal;
            text-align: center;
            margin-top: 10px;
            padding: 10px 0;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
          }
        }
      
        .nav-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .nav-logo img {
          height: 37px;
          width: auto;
          display: block;
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
          .nav-inner { padding: 10px 20px 0; }
        }
      `}} />
      
      <nav className="nav-wrapper" id="navWrapper">
        <div className="nav-inner">
      
          {/* Logo */}
          <div className="nav-logo">
            <img src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65e2c8c7fdd2f9e01030c70f_Premium%20Chimneys%20(Dark).svg" alt="Premium Chimneys" />
          </div>

          {/* Center trust line */}
          <div className="nav-center"><svg className="nav-star" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.77l-5.9 3.1 1.13-6.57L2.45 8.94l6.6-.96L12 2z" /></svg><strong>4.9</strong> rated • Trusted by <strong>1,000+</strong> DFW homeowners</div>

          {/* CTAs */}
          <div className="nav-ctas">
            <a href={`tel:${city.phone}`} className="nav-apply">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>{`
              ${city.phone_text}
            `}</a>
          </div>
      
        </div>
      
        {/* Separator */}
        <div className="nav-separator"></div>
      </nav>
    </>
  );
}
