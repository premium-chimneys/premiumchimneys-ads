

export default function Reviews({ city }) {
  return (
    <>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&display=swap');
      
        @keyframes faqPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      
        @keyframes badgeSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      
        @keyframes badgeShine {
          0% { opacity: 0; left: -50%; }
          40% { opacity: 0.6; }
          100% { opacity: 0; left: 150%; }
        }
      
        .tm-section * { margin: 0; padding: 0; box-sizing: border-box; }
      
        .tm-section {
          background: #faf9fe;
          padding: 128px 0 72px;
          position: relative;
          overflow-x: clip;
          overflow-y: visible;
          font-family: 'Inter Tight', sans-serif;
        }
      
        /* Massive faded quote marks */
        .tm-quote-left,
        .tm-quote-right {
          position: absolute;
          font-family: Georgia, serif;
          font-size: 700px;
          line-height: 1;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }
      
        .tm-quote-left {
          top: -120px;
          left: -60px;
          color: rgba(124, 58, 237, 0.035);
        }
      
        .tm-quote-right {
          bottom: -200px;
          right: -60px;
          color: rgba(124, 58, 237, 0.025);
          transform: rotate(180deg);
        }
      
        .tm-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }
      
        .tm-header {
          text-align: center;
          margin-bottom: 0;
          position: relative;
        }
      
        /* Scattered stars — static */
        .tm-star-scatter {
          position: absolute;
          display: block;
          line-height: 0;
          opacity: 0.2;
        }
        .tm-star-scatter svg {
          fill: #7c3aed;
          display: block;
        }
      
        .tm-star-scatter:nth-child(1) { top: -20px; left: 5%; animation-delay: 0s; }
        .tm-star-scatter:nth-child(1) svg { width: 14px; height: 14px; }
        .tm-star-scatter:nth-child(2) { top: 10px; left: 18%; animation-delay: 0.4s; }
        .tm-star-scatter:nth-child(2) svg { width: 10px; height: 10px; }
        .tm-star-scatter:nth-child(3) { top: -30px; left: 42%; animation-delay: 0.8s; }
        .tm-star-scatter:nth-child(3) svg { width: 12px; height: 12px; }
        .tm-star-scatter:nth-child(4) { top: 5px; right: 38%; animation-delay: 1.2s; }
        .tm-star-scatter:nth-child(4) svg { width: 16px; height: 16px; }
        .tm-star-scatter:nth-child(5) { top: -15px; right: 22%; animation-delay: 1.6s; }
        .tm-star-scatter:nth-child(5) svg { width: 11px; height: 11px; }
        .tm-star-scatter:nth-child(6) { top: 20px; right: 8%; animation-delay: 2.0s; }
        .tm-star-scatter:nth-child(6) svg { width: 13px; height: 13px; }
        .tm-star-scatter:nth-child(7) { top: -40px; left: 30%; animation-delay: 2.4s; }
        .tm-star-scatter:nth-child(7) svg { width: 9px; height: 9px; }
        .tm-star-scatter:nth-child(8) { top: 30px; right: 52%; animation-delay: 2.8s; }
        .tm-star-scatter:nth-child(8) svg { width: 15px; height: 15px; }
      
        .tm-big-stars {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-bottom: 20px;
        }
      
        .tm-big-star {
          width: 36px;
          height: 36px;
          fill: #7c3aed;
          filter: drop-shadow(0 2px 6px rgba(124, 58, 237, 0.35));
          transform-origin: center;
          animation: tmStarTwinkle 2.4s ease-in-out infinite;
        }
        .tm-big-star:nth-child(1) { animation-delay: 0s; }
        .tm-big-star:nth-child(2) { animation-delay: 0.25s; }
        .tm-big-star:nth-child(3) { animation-delay: 0.5s; }
        .tm-big-star:nth-child(4) { animation-delay: 0.75s; }
        .tm-big-star:nth-child(5) { animation-delay: 1s; }
        @keyframes tmStarTwinkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.15) rotate(6deg); opacity: 0.75; }
        }
      
        .tm-h2 {
          font-size: 48px;
          font-weight: 700;
          color: #1a1225;
          letter-spacing: -0.04em;
          line-height: 1.08;
          margin-bottom: 0;
        }

        @keyframes tmShimmerText { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .tm-h2-accent {
          background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: tmShimmerText 4s ease-in-out infinite;
        }
      
        .tm-subtitle {
          font-size: 18px;
          font-weight: 500;
          color: #6b6080;
          line-height: 1.5;
        }
      
        /* Guarantee sticker */
        .tm-guarantee {
          position: absolute;
          top: 30px;
          right: 40px;
          width: 120px;
          height: 120px;
          z-index: 2;
        }
      
        .tm-guarantee-ring {
          position: absolute;
          inset: 0;
          animation: badgeSpin 12s linear infinite;
        }
      
        .tm-guarantee-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #9b5de5);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
          overflow: hidden;
        }
      
        .tm-guarantee-check {
          width: 28px;
          height: 28px;
          fill: none;
          stroke: #fff;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          position: relative;
          z-index: 1;
        }
      
        .tm-guarantee-shine {
          position: absolute;
          top: 0;
          left: -50%;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          animation: badgeShine 3s ease-in-out infinite;
          pointer-events: none;
        }
      
        .tm-widget {
          margin-top: 48px;
          width: 100%;
          overflow: visible;
        }
      
        /* Responsive 960px */
        @media (max-width: 960px) {
          .tm-section { padding: 80px 0; }
          .tm-h2 { font-size: 38px; }
          .tm-subtitle { font-size: 16px; }
          .tm-quote-left,
          .tm-quote-right { font-size: 450px; }
          .tm-guarantee { width: 100px; height: 100px; top: 20px; right: 20px; }
          .tm-guarantee-center { width: 52px; height: 52px; }
          .tm-guarantee-check { width: 22px; height: 22px; }
        }
      
        /* Responsive 600px */
        @media (max-width: 600px) {
          .tm-section { padding: 80px 0; }
          .tm-h2 { font-size: 30px; }
          .tm-subtitle { font-size: 15px; }
          .tm-quote-left,
          .tm-quote-right { font-size: 300px; }
          .tm-big-star { width: 28px; height: 28px; }
          .tm-guarantee { width: 80px; height: 80px; top: 10px; right: 10px; }
          .tm-guarantee-center { width: 42px; height: 42px; }
          .tm-guarantee-check { width: 18px; height: 18px; }
          .tm-star-scatter { display: none; }
        }

        .tm-widget [class*="elfsight-app-"],
        .tm-widget [class*="elfsight-app-"] * {
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
      `}} />
      
      <section className="tm-section">
        {/* Faded quote marks */}
        <div className="tm-quote-left">&ldquo;</div>
        <div className="tm-quote-right">&rdquo;</div>
      
        <div className="tm-inner">
          <div className="tm-header">
            {/* 5 big stars */}
            <div className="tm-big-stars">
              <svg className="tm-big-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <svg className="tm-big-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <svg className="tm-big-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <svg className="tm-big-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <svg className="tm-big-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            </div>
      
            <h2 className="tm-h2">Read through our<br /><span className="tm-h2-accent">customer reviews.</span></h2>
      
            {/* Guarantee sticker */}
            <div className="tm-guarantee">
              <svg className="tm-guarantee-ring" viewBox="0 0 120 120">
                <defs>
                  <path id="tm-text-circle" d="M 60,60 m -48,0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0" fill="none" />
                </defs>
                <text fontSize="11" fontWeight="700" fill="#7c3aed" fontFamily="'Inter Tight', sans-serif" letterSpacing="3">
                  <textPath href="#tm-text-circle">Your satisfaction guaranteed · 100%</textPath>
                </text>
              </svg>
              <div className="tm-guarantee-center">
                <svg className="tm-guarantee-check" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#fff" strokeWidth="2" />
                  <polyline points="9 12 11 14 15 10" fill="none" stroke="#fff" strokeWidth="2.5" />
                </svg>
                <div className="tm-guarantee-shine"></div>
              </div>
            </div>
          </div>
      
        </div>
      </section>
      
      {/* Elfsight widget outside section */}
      <div style={{ background: '#faf9fe' }}>
        <div className="tm-widget" style={{ boxSizing: 'border-box', maxWidth: '1200px', margin: '0 auto', padding: '0 24px 72px', marginTop: '0' }}>
          <div className="elfsight-app-1f973617-d463-40e7-916a-3a2dfadb8a9b" data-elfsight-app-lazy={true}></div>
        </div>
      </div>
    </>
  );
}
