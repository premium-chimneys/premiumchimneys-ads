'use client'

export default function Placeholder({ city }) {
  const homeHref = `/homepage/${city?.slug ?? ''}`
  return (
    <section className="placeholder">
      <div className="card">
        <span className="dispatch">
          <span className="dispatch-dot" />
          <span className="dispatch-text">In Development</span>
        </span>
        <h2>This page is coming soon.</h2>
        <p>We&apos;re crafting something great. Check back shortly.</p>
        <a href={homeHref} className="submit">
          Back to Home
        </a>
      </div>

      <style jsx global>{`
        html {
          scrollbar-gutter: auto;
        }
        body {
          background:
            radial-gradient(circle at 20% 20%, rgba(167, 139, 250, 0.18), transparent 55%),
            radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.22), transparent 55%),
            linear-gradient(135deg, #0e0b14 0%, #15101e 50%, #1a1225 100%);
        }
      `}</style>
      <style jsx>{`
        .placeholder {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
          background:
            radial-gradient(circle at 20% 20%, rgba(167, 139, 250, 0.18), transparent 55%),
            radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.22), transparent 55%),
            linear-gradient(135deg, #0e0b14 0%, #15101e 50%, #1a1225 100%);
          overflow: hidden;
        }
        .card {
          position: relative;
          max-width: 520px;
          width: 100%;
          padding: 56px 44px;
          text-align: center;
          background: #ffffff;
          border: 1px solid rgba(124, 58, 237, 0.12);
          border-radius: 24px;
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.03) inset;
        }
        .dispatch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          margin-bottom: 24px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.22);
          border-radius: 999px;
        }
        .dispatch-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
          flex-shrink: 0;
          position: relative;
        }
        .dispatch-dot::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: rgba(22, 163, 74, 0.4);
          animation: livePing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .dispatch-text {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #16a34a;
          letter-spacing: 0.02em;
        }
        h2 {
          font-family: 'Inter Tight', sans-serif;
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          color: #1a1225;
          letter-spacing: -0.04em;
          line-height: 1.08;
          margin: 0 0 16px;
        }
        p {
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          font-weight: 400;
          color: #7c6f94;
          line-height: 1.65;
          margin: 0 0 28px;
        }
        .submit {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(160deg, #9b5de5 0%, #7c3aed 40%, #6d28d9 100%);
          text-decoration: none;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
          overflow: hidden;
          transition: all 0.25s ease;
        }
        .submit::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.15) 50%, transparent 60%);
          transform: skewX(-15deg);
          pointer-events: none;
          transition: left 0.6s ease;
        }
        .submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.5);
        }
        .submit:hover::before {
          left: 140%;
        }
        .submit:active {
          transform: translateY(0);
        }
        @keyframes livePing {
          0%   { transform: scale(1); opacity: 0.7; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
