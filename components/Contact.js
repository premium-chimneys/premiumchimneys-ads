
'use client';
import { useEffect } from 'react';

export default function Contact({ city }) {
  useEffect(() => {
    // ---- script block ----
    try {
      (function() {
          const form = document.getElementById('ct-contact-form');
          const success = document.getElementById('ct-success');
      
          // Set page URL
          const pageUrlInput = form.querySelector('input[name="page_url"]');
          if (pageUrlInput) pageUrlInput.value = window.location.href;
      
          form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = form.querySelector('.ct-submit-btn');
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.textContent = 'Sending...';
      
            try {
              const formData = new FormData(form);
              const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
              });
              const data = await res.json();
      
              if (data.success) {
                form.style.display = 'none';
                form.closest('.ct-form-inner').querySelector('.ct-dispatch').style.display = 'none';
                form.closest('.ct-form-inner').querySelector('.ct-disclaimer').style.display = 'none';
                form.closest('.ct-form-inner').querySelector('.ct-trust-row').style.display = 'none';
                success.classList.add('ct-active');
              } else {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.innerHTML = 'Send Request <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
                alert('Something went wrong. Please try again.');
              }
            } catch (err) {
              btn.disabled = false;
              btn.style.opacity = '1';
              btn.innerHTML = 'Send Request <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
              alert('Network error. Please try again.');
            }
          });
        })();
    } catch (e) { console.error('[component script]', e); }
  }, []);
  return (
    <>
      ) &#123;
        return <div></div>
      &#125;
      
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
      
        @keyframes successFadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      
        @keyframes successCheckPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      
        @keyframes successTextUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      
        .ct-section {
          background: #faf9fe;
          padding: 0 48px 120px;
          font-family: 'Inter Tight', sans-serif;
          box-sizing: border-box;
        }
      
        .ct-section *, .ct-section *::before, .ct-section *::after {
          box-sizing: border-box;
        }
      
        .ct-container {
          max-width: 1200px;
          margin: 0 auto;
        }
      
        .ct-heading {
          text-align: center;
          margin-top: 120px;
          margin-bottom: 56px;
        }
      
        .ct-heading h2 {
          font-size: 64px;
          font-weight: 800;
          color: #1a1a2e;
          margin: 0;
          line-height: 1.1;
        }
      
        .ct-heading .ct-hello {
          color: #7c3aed;
          display: inline-block;
          animation: jiggle 2s infinite;
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
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 6px;
        }
      
        .ct-card-value {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a2e;
        }
      
        .ct-card-value.ct-mono {
          font-family: 'IBM Plex Mono', monospace;
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
      
        /* Right Column – Form Card */
        .ct-form-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #ebe5f5;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.04);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
      
        .ct-form-aurora {
          height: 3px;
          background: linear-gradient(90deg, #7c3aed, #9b5de5, #c084fc, #7c3aed, #9b5de5);
          background-size: 300% 100%;
          animation: shimmerLine 4s linear infinite;
        }
      
        .ct-form-inner {
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
      
        .ct-form-title {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 8px;
        }
      
        .ct-form-subtitle {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 18px;
        }
      
        .ct-dispatch {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #16a34a;
          font-weight: 600;
          margin-bottom: 22px;
        }
      
        .ct-dispatch-dot {
          width: 8px;
          height: 8px;
          min-width: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
        }
      
        .ct-form-group {
          margin-bottom: 14px;
        }
      
        .ct-form-group input,
        .ct-form-group textarea {
          width: 100%;
          background: #faf9fe;
          border: 1.5px solid #ebe5f5;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          font-family: 'Inter Tight', sans-serif;
          color: #1a1a2e;
          outline: none;
          transition: border-color 0.2s ease;
        }
      
        .ct-form-group input::placeholder,
        .ct-form-group textarea::placeholder {
          color: #9ca3af;
        }
      
        .ct-form-group input:focus,
        .ct-form-group textarea:focus {
          border-color: #7c3aed;
        }
      
        .ct-form-group textarea {
          resize: vertical;
          min-height: 90px;
        }
      
        .ct-submit-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #7c3aed, #9b5de5);
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Inter Tight', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: opacity 0.2s ease, transform 0.2s ease;
          margin-top: 4px;
        }
      
        .ct-submit-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
      
        .ct-submit-btn svg {
          width: 18px;
          height: 18px;
        }
      
        .ct-disclaimer {
          font-size: 11px;
          color: #9ca3af;
          text-align: center;
          margin-top: 12px;
          line-height: 1.5;
        }
      
        .ct-trust-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f0edf5;
        }
      
        .ct-trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 500;
          color: #6b5c8a;
        }
      
        .ct-trust-item svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
      
        /* Success State */
        .ct-success {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
          animation: successFadeIn 0.5s ease;
        }
      
        .ct-success.ct-active {
          display: flex;
        }
      
        .ct-success-ring {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          animation: successCheckPop 0.6s ease 0.2s both;
        }
      
        .ct-success-ring svg {
          width: 36px;
          height: 36px;
          color: #fff;
        }
      
        .ct-success-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 8px;
          animation: successTextUp 0.5s ease 0.4s both;
        }
      
        .ct-success-text {
          font-size: 14px;
          color: #6b7280;
          animation: successTextUp 0.5s ease 0.6s both;
        }
      
        /* Responsive */
        @media (max-width: 960px) {
          .ct-layout {
            grid-template-columns: 1fr;
          }
      
          .ct-heading h2 {
            font-size: 48px;
          }
      
          .ct-section {
            padding: 0 24px 80px;
          }
      
          .ct-heading {
            margin-top: 80px;
            margin-bottom: 40px;
          }
        }
      
        @media (max-width: 600px) {
          .ct-heading h2 {
            font-size: 34px;
          }
      
          .ct-row-top {
            grid-template-columns: 1fr;
          }
      
          .ct-section {
            padding: 0 16px 60px;
          }
      
          .ct-heading {
            margin-top: 60px;
            margin-bottom: 32px;
          }
      
          .ct-trust-row {
            flex-direction: column;
            gap: 8px;
          }
      
          .ct-hours-row {
            flex-wrap: wrap;
          }
        }
      `}} />
      
      <section className="ct-section">
        <div className="ct-container">
          <div className="ct-heading">
            <h2>It's time to say <span className="ct-hello">hello</span> &#x1F44B;</h2>
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
                  <div className="ct-card-label">CALL US</div>
                  <div className="ct-card-value ct-mono">{`${city.phone_text}`}</div>
                </a>
                <a href="mailto:hello@premiumchimneys.com" className="ct-card" style={{ flex: '1' }}>
                  <div className="ct-card-icon ct-purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </div>
                  <div className="ct-card-label">EMAIL US</div>
                  <div className="ct-card-value">hello@premiumchimneys.com</div>
                </a>
              </div>
      
              {/* Row 2: Office Address */}
              <div className="ct-card">
                <div className="ct-card-icon ct-purple">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div className="ct-card-label">OFFICE ADDRESS</div>
                <div className="ct-card-value">{`${city.address}`}</div>
              </div>
      
              {/* Row 3: Working Hours */}
              <div className="ct-card">
                <div className="ct-hours-title">
                  <span>&#x1F550;</span> Working Hours
                </div>
                <div className="ct-hours-rows">
                  <div className="ct-hours-row">
                    <div className="ct-green-dot"></div>
                    <div className="ct-hours-day">Mon–Fri</div>
                    <div className="ct-hours-time">8:00 AM – 7:00 PM</div>
                  </div>
                  <div className="ct-hours-row">
                    <div className="ct-green-dot"></div>
                    <div className="ct-hours-day">Saturday</div>
                    <div className="ct-hours-time">8:00 AM – 5:00 PM</div>
                  </div>
                  <div className="ct-hours-row">
                    <div className="ct-green-dot"></div>
                    <div className="ct-hours-day">Sunday</div>
                    <div className="ct-hours-time">8:00 AM – 7:00 PM</div>
                  </div>
                </div>
                <div className="ct-speech-bubble">Yes, we work Saturdays! &#x1F4AA;</div>
              </div>
            </div>
      
            {/* Right Column – Form */}
            <div className="ct-form-card">
              <div className="ct-form-aurora"></div>
              <div className="ct-form-inner">
                <div className="ct-form-title">Request Service</div>
                <div className="ct-form-subtitle">Fill out our quick form to schedule a service call with our team today!</div>
                <div className="ct-dispatch">
                  <div className="ct-dispatch-dot"></div>
                  Goes straight to our dispatch team
                </div>
      
                <form className="wrapper-form-banner" id="ct-contact-form">
                  <input type="hidden" name="access_key" value="dd8ad38f-712e-4d31-8426-2579600f0df0" />
                  <input type="hidden" name="page_url" value="" />
                  <div className="ct-form-group">
                    <input type="text" name="name" placeholder="Full Name" required={true} />
                  </div>
                  <div className="ct-form-group">
                    <input type="tel" name="phone" placeholder="Phone Number" required={true} />
                  </div>
                  <div className="ct-form-group">
                    <input type="email" name="email" placeholder="Email Address" required={true} />
                  </div>
                  <div className="ct-form-group">
                    <textarea name="message" placeholder="How can we help?" rows="3"></textarea>
                  </div>
                  <button type="submit" className="ct-submit-btn">
                    Send Request
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  </button>
                </form>
      
                <div className="ct-disclaimer">By submitting, you agree to receive communication from our team. We respect your privacy.</div>
      
                <div className="ct-trust-row">
                  <div className="ct-trust-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    No spam
                  </div>
                  <div className="ct-trust-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    No obligation
                  </div>
                  <div className="ct-trust-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Call back in 1 hr
                  </div>
                </div>
      
                {/* Success State */}
                <div className="ct-success" id="ct-success">
                  <div className="ct-success-ring">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="ct-success-title">Submission Received</div>
                  <div className="ct-success-text">Our dispatch team will reach out shortly.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
