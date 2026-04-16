'use client';
import Form from './Form';

export default function FormBanner() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="fb-card">
        <div className="fb-aurora" />
        <div className="fb-grid">
          <div>
            <div className="fb-price-row">
              <span className="fb-price">$69</span>
              <div>
                <div className="fb-only">Only</div>
                <div className="fb-per">per inspection</div>
              </div>
            </div>
            <h2 className="fb-heading">
              Just fill out our form<br />to <span className="fb-heading-accent">get started.</span>
            </h2>
            <p className="fb-desc">
              Every job we take on starts the same way — a homeowner who finally picked up the phone. Book today and know exactly where your chimney stands.
            </p>
            <div className="fb-trust"><span>📅</span> Same-week availability</div>
            <div className="fb-trust"><span>🛡️</span> Insured &amp; bonded</div>
            <div className="fb-trust"><span>✅</span> 100% satisfaction guaranteed</div>
          </div>
          <Form />
        </div>
      </div>
    </>
  );
}

const css = `
  .fb-card {
    max-width: 1152px;
    margin: 0 auto;
    width: calc(100% - 48px);
    background: linear-gradient(135deg, #1a1025 0%, #130d1e 50%, #1a1025 100%);
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(124,58,237,0.15);
    font-family: 'Inter Tight', sans-serif;
  }
  .fb-aurora {
    height: 2px; width: 100%;
    background: linear-gradient(90deg, transparent, #7c3aed, #a78bfa, #c084fc, #a78bfa, #7c3aed, transparent);
    background-size: 300% 100%;
    animation: fb-line 4s ease-in-out infinite;
  }
  @keyframes fb-line { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

  .fb-grid {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 60px;
    padding: 64px;
    position: relative;
    z-index: 1;
    align-items: center;
  }

  .fb-price-row {
    display: inline-flex; align-items: center; gap: 10px;
    margin-bottom: 24px;
  }
  .fb-price {
    font-size: 52px; font-weight: 900;
    color: #fff;
    letter-spacing: -0.04em;
    line-height: 1;
  }
  .fb-only {
    font-size: 11px; font-weight: 600;
    color: #a78bfa;
    letter-spacing: 0.06em;
  }
  .fb-per {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
  }

  .fb-heading {
    font-size: 48px; font-weight: 700;
    color: #fff;
    letter-spacing: -0.04em;
    line-height: 1.08;
    margin: 0 0 16px;
  }
  .fb-heading-accent {
    background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fb-text 4s ease-in-out infinite;
  }
  @keyframes fb-text { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

  .fb-desc {
    font-size: 15px;
    color: rgba(255,255,255,0.4);
    line-height: 1.7;
    font-weight: 300;
    max-width: 420px;
    margin: 0 0 32px;
  }
  .fb-trust {
    display: flex; align-items: center; gap: 10px;
    font-size: 14px; font-weight: 400;
    color: rgba(255,255,255,0.55);
    margin-bottom: 14px;
  }

  @media (max-width: 960px) {
    .fb-grid { grid-template-columns: 1fr; padding: 40px 24px; }
    .fb-heading { font-size: 38px; }
  }
  @media (max-width: 600px) {
    .fb-card { width: 100%; border-radius: 0; border-left: none; border-right: none; }
    .fb-grid { padding: 32px 20px; gap: 32px; }
    .fb-price { font-size: 40px; }
    .fb-heading { font-size: 32px; }
  }
`;
