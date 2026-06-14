
'use client';

export default function NavigationBar({ city }) {
  return (
    <>

      <style dangerouslySetInnerHTML={{__html: `
        .nav-wrapper {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 999;
          background: #ffffff;
        }

        /* ─── Top sale bar: black, scrolling marquee ─── */
        .nav-sale {
          position: relative;
          width: 100%;
          background: #000000;
          overflow: hidden;
          cursor: pointer;
        }
        /* Full-bar transparent click targets (desktop = book, mobile = call) */
        .nav-sale-hit {
          position: absolute;
          inset: 0;
          display: block;
          z-index: 1;
          margin: 0;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .nav-sale-hit-mobile { display: none; }
        @media (max-width: 900px) {
          .nav-sale-hit-desktop { display: none; }
          .nav-sale-hit-mobile { display: block; }
        }
        .nav-sale-track {
          display: flex;
          width: max-content;
          animation: navSaleMarquee 55s linear infinite;
        }
        .nav-sale-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 26px;
          color: #ffffff;
          font-family: 'Inter Tight', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .nav-sale-item svg {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          color: #ffffff;
        }
        @keyframes navSaleMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-sale-track { animation: none; }
        }

        .nav-inner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 24px;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Inter Tight', sans-serif;
        }

        /* Desktop: compact location pin tag */
        .nav-location {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #4a3870;
          background: rgba(124, 58, 237, 0.06);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 100px;
          padding: 6px 14px 6px 10px;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        .nav-location svg { color: #7c3aed; }

        /* Google rated badge — desktop hidden, shown full-width on mobile */
        .nav-google { display: none; }

        @media (max-width: 900px) {
          .nav-inner {
            flex-wrap: wrap;
            height: auto;
            padding-top: 20px;
            padding-bottom: 0;
          }
          .nav-location { display: none; }

          .nav-google {
            order: 3;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin: 14px 0 18px;
            padding: 9px 14px;
            background: rgba(124, 58, 237, 0.05);
            border: 1px solid rgba(124, 58, 237, 0.14);
            border-radius: 10px;
            box-sizing: border-box;
          }
          .nav-google-g {
            width: 17px;
            height: 17px;
            flex-shrink: 0;
            display: block;
          }
          .nav-google-stars {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            color: #FFB400;
          }
          .nav-google-stars svg {
            width: 14px;
            height: 14px;
            display: block;
          }
          .nav-google-divider {
            width: 1px;
            height: 13px;
            background: rgba(74, 56, 112, 0.2);
          }
          .nav-google-score {
            font-family: 'Inter Tight', sans-serif;
            font-size: 13.5px;
            font-weight: 700;
            color: #2a1e42;
            font-variant-numeric: tabular-nums;
            line-height: 1;
          }
          .nav-google-label {
            font-family: 'Inter', 'Inter Tight', sans-serif;
            font-size: 13px;
            font-weight: 500;
            color: #4a3870;
            line-height: 1;
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
          .nav-inner { padding: 20px 20px 0; }
        }

      `}} />
      
      <nav className="nav-wrapper" id="navWrapper">

        {/* Top sale bar — black scrolling marquee (desktop: book popup, mobile: call) */}
        <div className="nav-sale">
          <div className="nav-sale-track" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <span className="nav-sale-item" key={i}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                Offering free inspections for limited time
              </span>
            ))}
          </div>
          <button type="button" className="nav-sale-hit nav-sale-hit-desktop" data-gateway-book aria-label="Book your free assessment" />
          <a href={`tel:${city.phone}`} className="nav-sale-hit nav-sale-hit-mobile" aria-label={`Call ${city.phone_text}`} />
        </div>

        <div className="nav-inner">
      
          {/* Logo */}
          <div className="nav-logo">
            <img src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65e2c8c7fdd2f9e01030c70f_Premium%20Chimneys%20(Dark).svg" alt="Premium Chimneys" />
          </div>

          {/* Google rated badge — mobile only, full-width row */}
          <div className="nav-google" role="img" aria-label="Rated 4.9 out of 5 on Google">
            <svg className="nav-google-g" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#34A853" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
              <path fill="#FBBC05" d="M12.717 28.054C12.255 26.785 12 25.42 12 24s.255-2.785.717-4.054l-6.571-4.819C4.762 17.823 4 20.812 4 24s.762 6.177 2.146 8.873l6.571-4.819z" />
              <path fill="#EA4335" d="M24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.227 4 9.505 8.444 6.146 15.127l6.571 4.819C14.381 15.317 18.798 12 24 12z" />
            </svg>
            <span className="nav-google-stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.8l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z" /></svg>
              ))}
            </span>
            <span className="nav-google-divider" aria-hidden="true"></span>
            <span className="nav-google-score">4.9</span>
            <span className="nav-google-label">Google rated</span>
          </div>

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
