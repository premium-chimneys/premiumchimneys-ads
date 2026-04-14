
'use client';
import { useEffect } from 'react';
import { getCalendlyUrl } from '@/lib/useCalendlyTracking';

export default function Hero({ city }) {
  useEffect(() => {
    // ---- script block ----
    try {
      (function() {
      
        // ─── Page URL field ──────────────────────────────────────────────────────────
        var urlField = document.getElementById('pageUrlField');
        if (urlField) urlField.value = window.location.href;
      
        // ─── Form submission ─────────────────────────────────────────────────────────
        var form = document.getElementById('heroForm');
        var card = document.getElementById('heroFormCard');
        var submitSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="flex-shrink:0"><path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      
        if (form && card) {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = form.querySelector('.hero-form-submit');
            btn.disabled = true;
            btn.innerHTML = submitSVG + ' Sending to dispatch...';
      
            var data = {};
            var inputs = form.querySelectorAll('input, textarea');
            for (var i = 0; i < inputs.length; i++) {
              if (inputs[i].name) data[inputs[i].name] = inputs[i].value;
            }
      
            fetch('https://api.web3forms.com/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
            .then(function(res) {
              if (res.ok) {
                card.classList.add('submitted');
              } else {
                btn.disabled = false;
                btn.innerHTML = submitSVG + ' Submit Request';
              }
            })
            .catch(function() {
              btn.disabled = false;
              btn.innerHTML = submitSVG + ' Submit Request';
            });
          });
        }
      
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
      ) &#123;
        return <div></div>
      &#125;
      
      
      
      
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
          padding: 236px 24px 128px;
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
          max-width: 380px;
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
      
        /* ─── FORM CARD ─────────────────────────────────────── */
        .hero-form-card {
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          overflow: hidden;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 80px rgba(124, 58, 237, 0.08);
        }
      
        .hero-form-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7c3aed, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa, #7c3aed);
          background-size: 300% 100%;
          animation: auroraSlide 4s ease-in-out infinite;
          z-index: 5;
        }
      
        @keyframes auroraSlide {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      
        .hero-form-card::after {
          content: '';
          position: absolute;
          top: 0; left: 15%; right: 15%;
          height: 1px;
          background: transparent;
          box-shadow: 0 0 30px 8px rgba(124, 58, 237, 0.08);
          pointer-events: none;
          z-index: 0;
          animation: glowPulse 4s ease-in-out infinite;
        }
      
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
      
        .hero-form-top { padding: 24px 28px 0; }
      
        .hero-form-title {
          font-family: 'Inter Tight', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #1a1225;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }
      
        .hero-form-subtitle {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          color: #7c6f94;
          margin: 0;
          line-height: 1.5;
        }
      
        .hero-form-dispatch {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 18px 28px 0;
          padding: 10px 14px;
          background: rgba(34, 197, 94, 0.06);
          border: 1px solid rgba(34, 197, 94, 0.18);
          border-radius: 10px;
        }
      
        .hero-form-dispatch-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #16a34a;
          flex-shrink: 0;
          position: relative;
        }
      
        .hero-form-dispatch-dot::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: rgba(22, 163, 74, 0.4);
          animation: livePing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      
        @keyframes livePing {
          0%   { transform: scale(1); opacity: 0.7; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      
        .hero-form-dispatch-text {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #16a34a;
          letter-spacing: 0.02em;
        }
      
        .hero-form-body { padding: 20px 28px 28px; }
      
        .hero-form-group { margin-bottom: 10px; position: relative; }
      
        .hero-form-input,
        .hero-form-textarea {
          width: 100%;
          font-family: 'Inter Tight', sans-serif;
          font-size: 14px;
          font-weight: 400;
          padding: 12px 16px;
          border: 1.5px solid rgba(124, 58, 237, 0.12);
          border-radius: 12px;
          background: #f8f6fd;
          color: #1a1225;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }
      
        .hero-form-input::placeholder,
        .hero-form-textarea::placeholder { color: #b0a4c4; }
      
        .hero-form-input:focus,
        .hero-form-textarea:focus {
          border-color: #7c3aed;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1), 0 0 20px rgba(124, 58, 237, 0.04);
        }
      
        .hero-form-textarea { resize: none; min-height: 80px; }
      
        .hero-form-submit {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(160deg, #9b5de5 0%, #7c3aed 40%, #6d28d9 100%);
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          margin-top: 6px;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
        }
      
        .hero-form-submit::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          transform: skewX(-15deg);
          pointer-events: none;
          transition: left 0.6s ease;
        }
      
        .hero-form-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.5);
        }
      
        .hero-form-submit:hover::before { left: 140%; }
        .hero-form-submit:active { transform: translateY(0); }
        .hero-form-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .hero-form-submit svg { position: relative; z-index: 1; }
      
        .hero-form-disclaimer {
          font-family: 'Inter Tight', sans-serif;
          font-size: 11px;
          color: #a099b2;
          margin-top: 14px;
          line-height: 1.5;
          text-align: center;
        }
      
        .hero-form-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
      
        .hero-form-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #6b5c8a;
        }
      
        /* ─── SUCCESS STATE ──────────────────────────────────── */
        .hero-form-success {
          text-align: center;
          padding: 56px 28px;
          animation: successFadeIn 0.6s ease-out both;
          display: none;
        }
      
        .hero-form-card.submitted .hero-form-success { display: block; }
        .hero-form-card.submitted .hero-form-top,
        .hero-form-card.submitted .hero-form-dispatch,
        .hero-form-card.submitted .hero-form-body { display: none; }
      
        @keyframes successFadeIn {
          0%   { opacity: 0; transform: scale(0.92) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      
        .hero-form-success-ring {
          width: 80px; height: 80px; border-radius: 50%;
          margin: 0 auto 24px; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
      
        .hero-form-success-ring::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, rgba(34,197,94,0.3), rgba(34,197,94,0.05), rgba(34,197,94,0.3));
          animation: ringRotate 3s linear infinite;
        }
      
        @keyframes ringRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      
        .hero-form-success-circle {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(145deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04));
          border: 1.5px solid rgba(34, 197, 94, 0.25);
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 1;
          box-shadow: 0 0 32px rgba(34, 197, 94, 0.12);
        }
      
        .hero-form-success-circle svg { animation: checkDraw 0.5s ease-out 0.3s both; }
      
        @keyframes checkDraw {
          0%   { opacity: 0; transform: scale(0.5); }
          50%  { opacity: 1; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
      
        .hero-form-success h3 {
          font-family: 'Inter Tight', sans-serif; font-size: 20px; font-weight: 700;
          color: #1a1225; margin: 0 0 10px; letter-spacing: -0.02em;
          animation: textSlideUp 0.5s ease-out 0.4s both;
        }
      
        .hero-form-success p {
          font-family: 'Inter Tight', sans-serif; font-size: 14px; color: #7c6f94;
          margin: 0 auto; line-height: 1.6; max-width: 280px;
          animation: textSlideUp 0.5s ease-out 0.55s both;
        }
      
        @keyframes textSlideUp {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      
        /* ─── RESPONSIVE ─────────────────────────────────────── */
        @media (max-width: 960px) {
          .hero-inner { grid-template-columns: 1fr; gap: 40px; padding: 168px 24px 60px; }
          .hero-h1 { font-size: 38px; max-width: 100%; }
          .hero-form-card { max-width: 480px; }
        }
      
        @media (max-width: 480px) {
          .hero-inner { padding: 148px 20px 48px; }
          .hero-h1 { font-size: 30px; }
          .hero-ctas { flex-direction: column; align-items: stretch; }
          .hero-cta-primary, .hero-cta-secondary { width: 100%; }
          .hero-form-top { padding: 20px 20px 0; }
          .hero-form-dispatch { margin: 14px 20px 0; }
          .hero-form-body { padding: 16px 20px 24px; }
          .hero-form-trust { flex-wrap: wrap; gap: 10px; }
        }
      `}} />
      
      <section className="hero">
        <video className="hero-video" autoplay={true} muted={true} loop={true} playsInline={true}>
          <source src="https://res.cloudinary.com/dnr8oynlg/video/upload/v1775893214/premium-chimneys-background-video_i1w9ta.mp4" type="video/mp4" />
        </video>
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
      
            <h1 className="hero-h1">{city.name}</h1>
      
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
      
          <div className="hero-form-card" id="heroFormCard">
            <div className="hero-form-success">
              <div className="hero-form-success-ring">
                <div className="hero-form-success-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <h3>Submission Received</h3>
              <p>Our dispatch team will reach out shortly.</p>
            </div>
      
            <div className="hero-form-top">
              <h2 className="hero-form-title">Request Service</h2>
              <p className="hero-form-subtitle">Fill out our quick form to schedule a service call with our team today!</p>
            </div>
      
            <div className="hero-form-dispatch">
              <span className="hero-form-dispatch-dot"></span>
              <span className="hero-form-dispatch-text">Goes straight to our dispatch team</span>
            </div>
      
            <div className="hero-form-body">
              <form className="wrapper-form-banner" id="heroForm">
                <input type="hidden" name="access_key" value="dd8ad38f-712e-4d31-8426-2579600f0df0" />
                <input type="hidden" name="page_url" id="pageUrlField" value="" />
                <div className="hero-form-group"><input className="hero-form-input" type="text" name="name" placeholder="Full Name" required={true} /></div>
                <div className="hero-form-group"><input className="hero-form-input" type="tel" name="phone" placeholder="Phone Number" required={true} /></div>
                <div className="hero-form-group"><input className="hero-form-input" type="email" name="email" placeholder="Email Address" required={true} /></div>
                <div className="hero-form-group"><textarea className="hero-form-textarea" name="message" placeholder="How can we help?"></textarea></div>
                <button className="hero-form-submit" type="submit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Submit Request
                </button>
                <p className="hero-form-disclaimer">By submitting, you agree to be contacted by one of our agents. Your information is confidential and won't be shared or sold.</p>
                <div className="hero-form-trust">
                  <span className="hero-form-trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> No spam</span>
                  <span className="hero-form-trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> No obligation</span>
                  <span className="hero-form-trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Call back in 1 hr</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
