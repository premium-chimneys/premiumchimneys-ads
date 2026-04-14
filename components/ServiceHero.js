'use client';
import { useEffect } from 'react';
import { getCalendlyUrl } from '@/lib/useCalendlyTracking';

export default function ServiceHero({ city, service, heading }) {
  useEffect(() => {
    try {
      (function() {
        var calBtn = document.getElementById('hsOpenCalendly');
        if (calBtn) {
          calBtn.addEventListener('click', function() {
            var url = getCalendlyUrl('https://calendly.com/premiumchimneys/inspection');
            function open() { if (window.Calendly) window.Calendly.initPopupWidget({ url: url }); }
            if (window.Calendly) { open(); }
            else {
              var t = setInterval(function() { if (window.Calendly) { clearInterval(t); open(); } }, 100);
            }
          });
        }

        var urlField = document.getElementById('hsPageUrl');
        if (urlField) urlField.value = window.location.href;

        var form = document.getElementById('hsForm');
        if (!form) return;

        var handler = function(e) {
          e.preventDefault();
          var btn = form.querySelector('.hs-submit');
          btn.disabled = true;
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg> Sending...';

          var data = {};
          var inputs = form.querySelectorAll('input, textarea');
          for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].name) data[inputs[i].name] = inputs[i].value;
          }

          fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          }).then(function(res) {
            if (res.ok) {
              btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Received';
              btn.style.background = '#16a34a';
            } else {
              btn.disabled = false;
              btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg> Submit Request';
            }
          }).catch(function() {
            btn.disabled = false;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg> Submit Request';
          });
        };

        form.addEventListener('submit', handler);
      })();
    } catch {}
  }, []);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&display=swap');

    .hs-hero * { margin: 0; padding: 0; box-sizing: border-box; }

    @keyframes hsShimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes hsLivePing { 0% { transform: scale(1); opacity: 0.7; } 75%, 100% { transform: scale(2.2); opacity: 0; } }
    @keyframes hsAuroraSlide { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

    .hs-hero {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .hs-hero-bg {
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }

    .hs-hero-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.8);
      z-index: 1;
    }

    .hs-inner {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 236px 24px 128px;
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 60px;
      align-items: center;
    }

    .hs-left {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .hs-badges {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      padding: 10px 18px;
      align-self: flex-start;
    }

    .hs-badge-img { height: 40px; width: auto; border-radius: 4px; display: block; }
    .hs-badge-reviews { max-width: 160px; }

    .hs-h1 {
      font-family: 'Inter Tight', sans-serif;
      font-size: 48px;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: #fff;
      max-width: 470px;
    }

    .hs-desc {
      font-family: 'Inter Tight', sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.65;
      color: rgba(255,255,255,0.6);
      max-width: 440px;
    }

    .hs-location {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Inter Tight', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255,255,255,0.55);
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 100px;
      padding: 8px 16px 8px 12px;
      width: fit-content;
    }

    .hs-ctas { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

    .hs-cta-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Inter Tight', sans-serif;
      font-size: 15px;
      font-weight: 600;
      color: #f0e0fd;
      text-decoration: none;
      padding: 14px 28px;
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

    .hs-cta-primary::before {
      content: '';
      position: absolute;
      top: 0; left: -70%;
      width: 40%; height: 100%;
      background: linear-gradient(105deg, transparent 35%, rgba(210,175,255,0.35) 50%, transparent 65%);
      transform: skewX(-12deg);
      pointer-events: none;
      transition: left 0.55s ease;
    }

    .hs-cta-primary:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(196,155,240,0.55), inset 0 -1px 0 rgba(0,0,0,0.22), 0 8px 24px rgba(91,33,182,0.5); }
    .hs-cta-primary:hover::before { left: 130%; }

    .hs-cta-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Inter Tight', sans-serif;
      font-size: 15px;
      font-weight: 500;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.04);
      transition: all 0.2s ease;
    }

    .hs-cta-secondary:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); color: #fff; }

    .hs-form-card {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.6);
      overflow: hidden;
      box-shadow: 0 24px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2), 0 0 80px rgba(124,58,237,0.08);
    }

    .hs-form-card::before {
      content: '';
      display: block;
      height: 3px;
      background: linear-gradient(90deg, #7c3aed, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa, #7c3aed);
      background-size: 300% 100%;
      animation: hsAuroraSlide 4s ease-in-out infinite;
    }

    .hs-form-header {
      padding: 24px 28px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .hs-form-title {
      font-family: 'Inter Tight', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #1a1225;
    }

    .hs-live-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: rgba(34,197,94,0.06);
      border: 1px solid rgba(34,197,94,0.18);
      border-radius: 100px;
    }

    .hs-live-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #16a34a;
      position: relative;
    }

    .hs-live-dot::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: rgba(22,163,74,0.4);
      animation: hsLivePing 1.5s cubic-bezier(0,0,0.2,1) infinite;
    }

    .hs-live-text {
      font-size: 11px;
      font-weight: 600;
      color: #16a34a;
      font-family: 'Inter Tight', sans-serif;
    }

    .hs-form-body { padding: 20px 28px 28px; }

    .hs-form { display: flex; flex-direction: column; gap: 10px; }

    .hs-input,
    .hs-textarea {
      width: 100%;
      padding: 12px 16px;
      font-size: 14px;
      font-family: 'Inter Tight', sans-serif;
      font-weight: 400;
      color: #1a1225;
      background: #f8f6fd;
      border: 1.5px solid rgba(124,58,237,0.12);
      border-radius: 12px;
      outline: none;
      transition: all 0.25s ease;
      box-sizing: border-box;
    }

    .hs-input::placeholder, .hs-textarea::placeholder { color: #b0a4c4; }
    .hs-input:focus, .hs-textarea:focus { border-color: #7c3aed; background: #fff; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
    .hs-textarea { resize: none; min-height: 80px; }

    .hs-submit {
      width: 100%;
      padding: 14px 24px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(160deg, #9b5de5 0%, #7c3aed 40%, #6d28d9 100%);
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      font-family: 'Inter Tight', sans-serif;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 20px rgba(124,58,237,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 6px;
      position: relative;
      overflow: hidden;
    }

    .hs-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124,58,237,0.5); }

    @media (max-width: 960px) {
      .hs-inner { grid-template-columns: 1fr; gap: 40px; padding: 168px 24px 60px; }
      .hs-h1 { font-size: 38px; max-width: 100%; }
      .hs-form-card { max-width: 480px; }
    }

    @media (max-width: 480px) {
      .hs-inner { padding: 148px 20px 48px; }
      .hs-h1 { font-size: 30px; }
      .hs-ctas { flex-direction: column; align-items: stretch; }
      .hs-cta-primary, .hs-cta-secondary { width: 100%; justify-content: center; text-align: center; }
      .hs-form-header { flex-direction: column; align-items: flex-start; gap: 12px; }
      .hs-badges { flex-wrap: wrap; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="hs-hero">
        <img className="hs-hero-bg" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da86840f464e36c79b_chimney-inspection-roofline-flue-evaluation.webp" alt="" />
        <div className="hs-hero-overlay"></div>

        <div className="hs-inner">
          {/* Left */}
          <div className="hs-left">
            {/* Trust badges */}
            <div className="hs-badges">
              <img className="hs-badge-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/69498dcf9a206ed260446ac6_bbb-accredited-business-logo.webp" alt="BBB Accredited" />
              <img className="hs-badge-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65ea3566667e1e282004fb81_Home%20Advisor%20Badge.svg" alt="HomeAdvisor" />
              <div className="hs-badge-reviews">
                <div className="elfsight-app-5b84b319-0dc0-446d-bab1-a30a175838f4" data-elfsight-app-lazy=""></div>
              </div>
            </div>

            <h1 className="hs-h1">{heading}</h1>

            <p className="hs-desc">Our inspectors use advanced diagnostic tools to evaluate your chimney's safety and structural integrity from top to bottom. Receive a detailed safety report with clear next steps.</p>

            <div className="hs-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {city?.name}
            </div>

            <div className="hs-ctas">
              <button type="button" className="hs-cta-primary" id="hsOpenCalendly">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                Book Appointment
              </button>
              <a href={`tel:${city?.phone ?? ''}`} className="hs-cta-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                {city?.phone_text}
              </a>
            </div>
          </div>

          {/* Right — Form */}
          <div className="hs-form-card">
            <div className="hs-form-header">
              <div className="hs-form-title">Request Service</div>
              <div className="hs-live-pill">
                <div className="hs-live-dot"></div>
                <span className="hs-live-text">Live</span>
              </div>
            </div>
            <div className="hs-form-body">
              <form className="wrapper-form-banner hs-form" id="hsForm">
                <input type="hidden" name="access_key" value="dd8ad38f-712e-4d31-8426-2579600f0df0" />
                <input type="hidden" name="page_url" id="hsPageUrl" defaultValue="" />
                <input className="hs-input" type="text" name="name" placeholder="Full Name" required />
                <input className="hs-input" type="tel" name="phone" placeholder="Phone Number" required />
                <input className="hs-input" type="email" name="email" placeholder="Email Address" required />
                <textarea className="hs-textarea" name="message" placeholder="How can we help?" rows="3"></textarea>
                <button className="hs-submit" type="submit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
