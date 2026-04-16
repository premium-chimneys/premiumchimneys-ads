
'use client';
import Form from './Form';

export default function Contact({ city }) {
  return (
    <>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes jiggle {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-4deg); }
          30% { transform: rotate(3deg); }
          45% { transform: rotate(-2deg); }
          60% { transform: rotate(1deg); }
          75% { transform: rotate(0deg); }
        }
      
        @keyframes shimmerLine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      
        @keyframes faqPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
        }
      
        .ct-section {
          background: #faf9fe;
          padding: 0 0 128px;
          font-family: 'Inter Tight', sans-serif;
          box-sizing: border-box;
        }
      
        .ct-section *, .ct-section *::before, .ct-section *::after {
          box-sizing: border-box;
        }
      
        .ct-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
      
        .ct-heading {
          text-align: center;
          margin-bottom: 56px;
        }
      
        .ct-heading h2 {
          font-family: 'Inter Tight', sans-serif;
          font-size: 48px;
          font-weight: 700;
          color: #1a1225;
          letter-spacing: -0.04em;
          line-height: 1.08;
          margin: 0;
        }

        @keyframes ctShimmerText { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .ct-heading .ct-hello-wrap {
          display: inline-block;
          animation: jiggle 2s infinite;
          transform-origin: center bottom;
        }
        .ct-heading .ct-hello {
          display: inline-block;
          background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ctShimmerText 4s ease-in-out infinite;
        }
      
        .ct-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 24px;
          align-items: stretch;
        }
      
        .ct-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      
        .ct-row-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          flex: 1;
          align-items: stretch;
        }
      
        .ct-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #ebe5f5;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.04);
          text-decoration: none;
          color: inherit;
          display: block;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
      
        a.ct-card:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 16px rgba(124, 58, 237, 0.1);
        }

        .ct-row-top .ct-card {
          display: flex;
          flex-direction: column;
        }
        .ct-row-top .ct-card .ct-card-label {
          margin-top: auto;
        }
      
        .ct-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
      
        .ct-card-icon svg {
          width: 22px;
          height: 22px;
          color: #fff;
        }
      
        .ct-card-icon.ct-green {
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }
      
        .ct-card-icon.ct-purple {
          background: linear-gradient(135deg, #7c3aed, #9b5de5);
        }
      
        .ct-card-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2px;
          color: #9ca3af;
          margin-bottom: 6px;
        }
      
        .ct-card-value {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a2e;
        }
      
        .ct-card-value.ct-mono {
          font-family: 'Inter Tight', sans-serif;
        }
      
        /* Working Hours Card */
        .ct-hours-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 18px;
        }
      
        .ct-hours-title span {
          font-size: 22px;
        }
      
        .ct-hours-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      
        .ct-hours-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
      
        .ct-green-dot {
          width: 8px;
          height: 8px;
          min-width: 8px;
          border-radius: 50%;
          background: #22c55e;
          animation: faqPulse 2s infinite;
        }
      
        .ct-hours-day {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a2e;
          min-width: 90px;
        }
      
        .ct-hours-time {
          font-size: 14px;
          font-family: 'IBM Plex Mono', monospace;
          color: #7c3aed;
          font-weight: 500;
        }
      
        .ct-speech-bubble {
          position: relative;
          background: #f5f0ff;
          border-radius: 12px;
          padding: 12px 16px;
          margin-top: 16px;
          font-size: 14px;
          font-style: italic;
          color: #7c3aed;
          font-weight: 500;
        }
      
        .ct-speech-bubble::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 24px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid #f5f0ff;
        }
      
        /* Responsive */
        @media (max-width: 960px) {
          .ct-layout {
            grid-template-columns: 1fr;
          }
      
          .ct-heading h2 {
            font-size: 38px;
          }

          .ct-section {
            padding: 0 0 80px;
          }

          .ct-heading {
            margin-bottom: 40px;
          }
        }
      
        @media (max-width: 600px) {
          .ct-heading h2 {
            font-size: 30px;
          }
      
          .ct-row-top {
            grid-template-columns: 1fr;
          }
      
          .ct-section {
            padding: 0 0 80px;
          }
      
          .ct-heading {
            margin-bottom: 32px;
          }
      
          .ct-hours-row {
            flex-wrap: wrap;
          }
        }
      `}} />
      
      <section className="ct-section">
        <div className="ct-container">
          <div className="ct-heading">
            <h2>It's time to say <span className="ct-hello-wrap"><span className="ct-hello">hello</span> &#x1F44B;</span></h2>
          </div>
      
          <div className="ct-layout">
            {/* Left Column */}
            <div className="ct-left">
              {/* Row 1: Phone + Email */}
              <div className="ct-row-top">
                <a href={`tel:${city.phone}`} className="ct-card" style={{ flex: '1' }}>
                  <div className="ct-card-icon ct-green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <div className="ct-card-label">Call us</div>
                  <div className="ct-card-value ct-mono">{`${city.phone_text}`}</div>
                </a>
                <a href="mailto:hello@premiumchimneys.com" className="ct-card" style={{ flex: '1' }}>
                  <div className="ct-card-icon ct-purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </div>
                  <div className="ct-card-label">Email us</div>
                  <div className="ct-card-value">hello@premiumchimneys.com</div>
                </a>
              </div>
      
              {/* Row 2: Office Address */}
              <div className="ct-card">
                <div className="ct-card-icon ct-purple">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div className="ct-card-label">Office address</div>
                <div className="ct-card-value">{city.service_area}</div>
              </div>
      
              {/* Row 3: Working Hours */}
              <div className="ct-card">
                <div className="ct-hours-title">
                  <span>&#x1F550;</span> Working Hours
                </div>
                <div className="ct-hours-rows">
                  <div className="ct-hours-row">
                    <div className="ct-green-dot"></div>
                    <div className="ct-hours-day">Everyday</div>
                    <div className="ct-hours-time">8:00 AM – 7:00 PM</div>
                  </div>
                </div>
                <div className="ct-speech-bubble">Yes, we work on weekends! &#x1F4AA;</div>
              </div>
            </div>
      
            {/* Right Column – Form */}
            <Form />
          </div>
        </div>
      </section>
    </>
  );
}
