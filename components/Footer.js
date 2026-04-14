'use client'

import { getCalendlyUrl } from '@/lib/useCalendlyTracking'

export default function Footer({ city }) {
  return (
    <>
      ) &#123;
        return <div></div>
      &#125;
      
      {/* Calendly widget assets */}
      
      
      
      <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800&display=swap');
      
      .footer-wrap {
        font-family: 'Inter Tight', sans-serif;
        background: linear-gradient(180deg, #000000 0%, #000000 35%, #05031a 50%, #0a0724 58%, #110d38 65%, #1a1454 72%, #2a2072 80%, #3d3199 88%, #6053f6 100%);
        color: #fff;
        padding: 60px 40px 30px;
        margin-top: 0;
        position: relative;
        overflow: hidden;
      }
      
      /* === black overlay === */
      .footer-wrap::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        opacity: 0.8;
        pointer-events: none;
        z-index: 0;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }
      
      /* === ambient glow === */
      .footer-glow {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 800px;
        height: 120px;
        background: radial-gradient(ellipse at center bottom, rgba(245,158,11,0.18) 0%, rgba(239,68,68,0.06) 50%, transparent 80%);
        pointer-events: none;
        z-index: 0;
        filter: blur(40px);
        animation: glowPulse 3s ease-in-out infinite;
      }
      
      /* === flame container === */
      .footer-flames {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 1000px;
        height: 380px;
        pointer-events: none;
        z-index: 0;
      }
      
      .footer-inner {
        position: relative;
        z-index: 1;
        max-width: 1400px;
        margin: 0 auto;
        padding-left: 64px;
        padding-right: 64px;
        box-sizing: border-box;
      }
      
      /* === outer flame (soft glow layer) === */
      .flame-outer {
        position: absolute;
        bottom: -15px;
        border-radius: 45% 45% 50% 50% / 60% 60% 40% 40%;
        filter: blur(25px);
        transform-origin: bottom center;
        opacity: 0.10;
      }
      
      /* === mid flame (body) === */
      .flame-mid {
        position: absolute;
        bottom: -8px;
        border-radius: 40% 40% 48% 48% / 65% 65% 35% 35%;
        filter: blur(12px);
        transform-origin: bottom center;
        opacity: 0.14;
      }
      
      /* === inner core (bright hot center) === */
      .flame-core {
        position: absolute;
        bottom: 0;
        border-radius: 35% 35% 50% 50% / 70% 70% 30% 30%;
        filter: blur(6px);
        transform-origin: bottom center;
        opacity: 0.12;
      }
      
      /* === sparks === */
      .spark {
        position: absolute;
        bottom: 40px;
        width: 2px;
        height: 6px;
        border-radius: 1px;
        background: #fcd34d;
        opacity: 0;
        filter: blur(0.5px);
        pointer-events: none;
        box-shadow: 0 0 4px 1px rgba(251,191,36,0.35);
      }
      
      /* ---- Flame group 1 (far left) ---- */
      .fo-1 { left: calc(50% - 280px); width: 100px; height: 120px; background: radial-gradient(ellipse at 50% 90%, #f97316 0%, #dc2626 40%, transparent 75%); animation: sway1 4s ease-in-out infinite; }
      .fm-1 { left: calc(50% - 265px); width: 70px; height: 100px; background: radial-gradient(ellipse at 50% 85%, #fbbf24 0%, #f97316 45%, transparent 80%); animation: sway2 3.2s ease-in-out infinite 0.2s; }
      .fc-1 { left: calc(50% - 255px); width: 40px; height: 70px; background: radial-gradient(ellipse at 50% 80%, #fef3c7 0%, #fbbf24 50%, transparent 85%); animation: sway3 2.6s ease-in-out infinite 0.1s; }
      
      /* ---- Flame group 2 (left) ---- */
      .fo-2 { left: calc(50% - 190px); width: 120px; height: 170px; background: radial-gradient(ellipse at 50% 90%, #ef4444 0%, #991b1b 45%, transparent 75%); animation: sway2 4.5s ease-in-out infinite 0.5s; }
      .fm-2 { left: calc(50% - 170px); width: 80px; height: 140px; background: radial-gradient(ellipse at 50% 85%, #f59e0b 0%, #ef4444 40%, transparent 78%); animation: sway3 3.5s ease-in-out infinite 0.3s; }
      .fc-2 { left: calc(50% - 158px); width: 48px; height: 100px; background: radial-gradient(ellipse at 50% 80%, #fef9c3 0%, #fcd34d 45%, transparent 82%); animation: sway1 2.8s ease-in-out infinite 0.4s; }
      
      /* ---- Flame group 3 (center-left) ---- */
      .fo-3 { left: calc(50% - 100px); width: 140px; height: 230px; background: radial-gradient(ellipse at 50% 90%, #f97316 0%, #dc2626 35%, transparent 72%); animation: sway3 4.2s ease-in-out infinite 0.2s; }
      .fm-3 { left: calc(50% - 75px); width: 95px; height: 190px; background: radial-gradient(ellipse at 50% 85%, #fbbf24 0%, #f97316 38%, transparent 76%); animation: sway1 3.4s ease-in-out infinite 0.6s; }
      .fc-3 { left: calc(50% - 58px); width: 55px; height: 140px; background: radial-gradient(ellipse at 50% 80%, #fffbeb 0%, #fbbf24 40%, transparent 80%); animation: sway2 2.7s ease-in-out infinite 0.3s; }
      
      /* ---- Flame group 4 (center — tallest) ---- */
      .fo-4 { left: calc(50% - 45px); width: 130px; height: 290px; background: radial-gradient(ellipse at 50% 92%, #f97316 0%, #b91c1c 40%, transparent 72%); animation: sway1 3.6s ease-in-out infinite 0.1s; }
      .fm-4 { left: calc(50% - 25px); width: 85px; height: 240px; background: radial-gradient(ellipse at 50% 88%, #fcd34d 0%, #f59e0b 35%, transparent 75%); animation: sway3 3s ease-in-out infinite 0.4s; }
      .fc-4 { left: calc(50% - 10px); width: 50px; height: 180px; background: radial-gradient(ellipse at 50% 82%, #ffffff 0%, #fef3c7 30%, #fbbf24 55%, transparent 82%); animation: sway2 2.4s ease-in-out infinite 0.2s; }
      
      /* ---- Flame group 5 (center-right) ---- */
      .fo-5 { left: calc(50% + 20px); width: 130px; height: 210px; background: radial-gradient(ellipse at 50% 90%, #ef4444 0%, #991b1b 42%, transparent 74%); animation: sway2 4.1s ease-in-out infinite 0.7s; }
      .fm-5 { left: calc(50% + 40px); width: 90px; height: 175px; background: radial-gradient(ellipse at 50% 85%, #f59e0b 0%, #ef4444 40%, transparent 78%); animation: sway1 3.3s ease-in-out infinite 0.5s; }
      .fc-5 { left: calc(50% + 55px); width: 52px; height: 125px; background: radial-gradient(ellipse at 50% 80%, #fef9c3 0%, #fcd34d 42%, transparent 80%); animation: sway3 2.5s ease-in-out infinite 0.35s; }
      
      /* ---- Flame group 6 (right) ---- */
      .fo-6 { left: calc(50% + 110px); width: 115px; height: 160px; background: radial-gradient(ellipse at 50% 90%, #f97316 0%, #dc2626 42%, transparent 74%); animation: sway3 3.8s ease-in-out infinite 0.3s; }
      .fm-6 { left: calc(50% + 128px); width: 75px; height: 130px; background: radial-gradient(ellipse at 50% 85%, #fbbf24 0%, #f97316 42%, transparent 78%); animation: sway2 3s ease-in-out infinite 0.6s; }
      .fc-6 { left: calc(50% + 140px); width: 44px; height: 90px; background: radial-gradient(ellipse at 50% 80%, #fef3c7 0%, #fbbf24 48%, transparent 82%); animation: sway1 2.6s ease-in-out infinite 0.25s; }
      
      /* ---- Flame group 7 (far right) ---- */
      .fo-7 { left: calc(50% + 200px); width: 95px; height: 110px; background: radial-gradient(ellipse at 50% 90%, #ef4444 0%, #991b1b 44%, transparent 76%); animation: sway1 4.4s ease-in-out infinite 0.8s; }
      .fm-7 { left: calc(50% + 213px); width: 65px; height: 90px; background: radial-gradient(ellipse at 50% 85%, #f59e0b 0%, #ef4444 44%, transparent 80%); animation: sway3 3.4s ease-in-out infinite 0.45s; }
      .fc-7 { left: calc(50% + 223px); width: 38px; height: 60px; background: radial-gradient(ellipse at 50% 80%, #fef9c3 0%, #fcd34d 50%, transparent 85%); animation: sway2 2.7s ease-in-out infinite 0.55s; }
      
      /* ---- Sparks ---- */
      .spark-1  { left: calc(50% - 30px);  animation: sparkRise1 3.2s ease-out infinite 0.1s; }
      .spark-2  { left: calc(50% + 15px);  animation: sparkRise2 3.8s ease-out infinite 0.6s; }
      .spark-3  { left: calc(50% - 80px);  animation: sparkRise3 2.8s ease-out infinite 1.0s; }
      .spark-4  { left: calc(50% + 60px);  animation: sparkRise1 3.5s ease-out infinite 0.3s; }
      .spark-5  { left: calc(50% - 10px);  animation: sparkRise2 3s ease-out infinite 1.4s; }
      .spark-6  { left: calc(50% + 100px); animation: sparkRise3 4s ease-out infinite 0.2s; }
      .spark-7  { left: calc(50% - 150px); animation: sparkRise1 3.4s ease-out infinite 0.8s; }
      .spark-8  { left: calc(50% + 140px); animation: sparkRise2 3.6s ease-out infinite 0.5s; }
      .spark-9  { left: calc(50% + 40px);  animation: sparkRise3 3.1s ease-out infinite 1.1s; }
      .spark-10 { left: calc(50% - 55px);  animation: sparkRise1 3.8s ease-out infinite 0.4s; }
      .spark-11 { left: calc(50% + 5px);   animation: sparkRise2 2.6s ease-out infinite 0.9s; }
      .spark-12 { left: calc(50% - 120px); animation: sparkRise3 3.5s ease-out infinite 1.3s; }
      
      /* === Animations === */
      @keyframes sway1 {
        0%, 100% { transform: scaleY(1) scaleX(1) translateX(0) rotate(0deg); }
        15% { transform: scaleY(1.15) scaleX(0.88) translateX(-7px) rotate(-2.5deg); }
        30% { transform: scaleY(1.35) scaleX(0.76) translateX(4px) rotate(1.5deg); }
        50% { transform: scaleY(1.08) scaleX(0.94) translateX(-3px) rotate(-1deg); }
        65% { transform: scaleY(1.28) scaleX(0.8) translateX(6px) rotate(2deg); }
        80% { transform: scaleY(1.12) scaleX(0.9) translateX(-5px) rotate(-1.5deg); }
      }
      @keyframes sway2 {
        0%, 100% { transform: scaleY(1) scaleX(1) translateX(0) rotate(0deg); }
        12% { transform: scaleY(1.22) scaleX(0.84) translateX(6px) rotate(2deg); }
        28% { transform: scaleY(1.08) scaleX(0.92) translateX(-4px) rotate(-1.5deg); }
        45% { transform: scaleY(1.38) scaleX(0.74) translateX(3px) rotate(1deg); }
        60% { transform: scaleY(1.18) scaleX(0.86) translateX(-7px) rotate(-2.5deg); }
        78% { transform: scaleY(1.3) scaleX(0.78) translateX(5px) rotate(2.5deg); }
        90% { transform: scaleY(1.05) scaleX(0.95) translateX(-2px) rotate(-0.5deg); }
      }
      @keyframes sway3 {
        0%, 100% { transform: scaleY(1) scaleX(1) translateX(0) rotate(0deg); }
        10% { transform: scaleY(1.2) scaleX(0.86) translateX(-5px) rotate(-1.5deg); }
        25% { transform: scaleY(1.4) scaleX(0.72) translateX(7px) rotate(3deg); }
        40% { transform: scaleY(1.1) scaleX(0.92) translateX(-3px) rotate(-0.5deg); }
        55% { transform: scaleY(1.32) scaleX(0.78) translateX(5px) rotate(2deg); }
        72% { transform: scaleY(1.14) scaleX(0.88) translateX(-6px) rotate(-2deg); }
        88% { transform: scaleY(1.26) scaleX(0.82) translateX(2px) rotate(1deg); }
      }
      @keyframes sparkRise1 {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        8% { opacity: 0.6; }
        30% { transform: translateY(-60px) translateX(12px) rotate(30deg); opacity: 0.5; }
        60% { transform: translateY(-140px) translateX(-8px) rotate(-15deg); opacity: 0.25; }
        100% { transform: translateY(-240px) translateX(5px) rotate(20deg); opacity: 0; }
      }
      @keyframes sparkRise2 {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.55; }
        25% { transform: translateY(-50px) translateX(-10px) rotate(-25deg); opacity: 0.45; }
        55% { transform: translateY(-130px) translateX(14px) rotate(20deg); opacity: 0.2; }
        100% { transform: translateY(-220px) translateX(-6px) rotate(-10deg); opacity: 0; }
      }
      @keyframes sparkRise3 {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        6% { opacity: 0.6; }
        35% { transform: translateY(-70px) translateX(8px) rotate(40deg); opacity: 0.4; }
        65% { transform: translateY(-160px) translateX(-12px) rotate(-20deg); opacity: 0.18; }
        100% { transform: translateY(-260px) translateX(3px) rotate(15deg); opacity: 0; }
      }
      @keyframes glowPulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }
      
      .footer-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 40px;
        flex-wrap: wrap;
      }
      .footer-left {
        flex: 1;
        min-width: 280px;
      }
      .footer-heading {
        font-size: 36px;
        font-weight: 600;
        line-height: 1.2;
        margin: 0 0 28px;
        font-family: inherit;
        color: #fff;
      }
      .footer-hours-title {
        font-size: 15px;
        font-weight: 600;
        margin: 0 0 6px;
        color: #fff;
      }
      .footer-hours {
        font-size: 14px;
        color: rgba(255,255,255,0.55);
        margin: 0 0 4px;
        line-height: 1.6;
      }
      .footer-service-title {
        font-size: 15px;
        font-weight: 600;
        margin: 20px 0 6px;
        color: #fff;
      }
      .footer-service-area {
        font-size: 14px;
        color: rgba(255,255,255,0.55);
        margin: 0;
      }
      .footer-bbb {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-top: 28px;
      }
      .footer-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 14px;
        min-width: 220px;
      }
      .footer-btn-book {
        background: #6c5ce7;
        color: #fff;
        border: none;
        border-radius: 50px;
        padding: 14px 36px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.2s;
        text-align: center;
        width: 240px;
        font-family: 'Inter Tight', sans-serif;
      }
      .footer-btn-book:hover {
        background: #5a4bd4;
      }
      .footer-btn-phone {
        background: transparent;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 50px;
        padding: 14px 36px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        transition: border-color 0.2s;
        text-align: center;
        width: 240px;
        font-family: 'Inter Tight', sans-serif;
        box-sizing: border-box;
      }
      .footer-btn-phone:hover {
        border-color: rgba(255,255,255,0.5);
      }
      .footer-divider {
        border: none;
        border-top: 1px solid rgba(255,255,255,0.08);
        margin: 40px 0 20px;
      }
      .footer-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }
      .footer-copyright {
        font-size: 13px;
        color: rgba(255,255,255,0.4);
        margin: 0;
      }
      .footer-bottom-right {
        display: flex;
        align-items: center;
        gap: 24px;
      }
      .footer-socials {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .footer-social-icon {
        width: 20px;
        height: 20px;
        color: rgba(255,255,255,0.6);
        transition: color 0.2s;
        cursor: pointer;
      }
      .footer-social-icon:hover {
        color: #fff;
      }
      .footer-links {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .footer-link {
        font-size: 13px;
        color: rgba(255,255,255,0.5);
        text-decoration: none;
        transition: color 0.2s;
      }
      .footer-link:hover {
        color: #fff;
      }
      
      @media (max-width: 768px) {
        .footer-wrap {
          padding: 40px 16px 24px;
        }
        .footer-inner {
          padding-left: 0;
          padding-right: 0;
        }
        .footer-top {
          flex-direction: column;
          align-items: flex-start;
        }
        .footer-right {
          align-items: flex-start;
        }
        .footer-bottom {
          flex-direction: column;
          align-items: flex-start;
        }
        .footer-bottom-right {
          flex-direction: column;
          align-items: flex-start;
        }
        .footer-heading {
          font-size: 28px;
        }
      }
      `}} />
      
      <footer className="footer-wrap">
        <div className="footer-glow"></div>
        <div className="footer-flames">
          {/* Flame group 1 — far left */}
          <div className="flame-outer fo-1"></div>
          <div className="flame-mid fm-1"></div>
          <div className="flame-core fc-1"></div>
          {/* Flame group 2 — left */}
          <div className="flame-outer fo-2"></div>
          <div className="flame-mid fm-2"></div>
          <div className="flame-core fc-2"></div>
          {/* Flame group 3 — center-left */}
          <div className="flame-outer fo-3"></div>
          <div className="flame-mid fm-3"></div>
          <div className="flame-core fc-3"></div>
          {/* Flame group 4 — center (tallest) */}
          <div className="flame-outer fo-4"></div>
          <div className="flame-mid fm-4"></div>
          <div className="flame-core fc-4"></div>
          {/* Flame group 5 — center-right */}
          <div className="flame-outer fo-5"></div>
          <div className="flame-mid fm-5"></div>
          <div className="flame-core fc-5"></div>
          {/* Flame group 6 — right */}
          <div className="flame-outer fo-6"></div>
          <div className="flame-mid fm-6"></div>
          <div className="flame-core fc-6"></div>
          {/* Flame group 7 — far right */}
          <div className="flame-outer fo-7"></div>
          <div className="flame-mid fm-7"></div>
          <div className="flame-core fc-7"></div>
          {/* Sparks */}
          <div className="spark spark-1"></div>
          <div className="spark spark-2"></div>
          <div className="spark spark-3"></div>
          <div className="spark spark-4"></div>
          <div className="spark spark-5"></div>
          <div className="spark spark-6"></div>
          <div className="spark spark-7"></div>
          <div className="spark spark-8"></div>
          <div className="spark spark-9"></div>
          <div className="spark spark-10"></div>
          <div className="spark spark-11"></div>
          <div className="spark spark-12"></div>
        </div>
      
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-left">
              <h2 className="footer-heading">Your Local Chimney &<br />Fireplace Experts</h2>
      
              <p className="footer-hours-title">Working Hours:</p>
              <p className="footer-hours">
                Sunday - Friday: 8:00 AM - 7:00 PM<br />
                Saturday: 8:00 AM - 5:00 PM
              </p>
      
              <p className="footer-service-title">Service Area:</p>
              <p className="footer-service-area">{`${city.address}`}</p>
      
              <div className="footer-bbb">
                <img src="https://seal-dallas.bbb.org/seals/blue-seal-293-61-whitetxt-bbb-91352067.png" alt="Premium Chimneys BBB Business Review" style={{ border: '0', maxWidth: '293px', width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }} />
              </div>
            </div>
      
            <div className="footer-right">
              <button className="footer-btn-book" onClick={(e) => { e.preventDefault(); if (typeof window !== 'undefined' && window.Calendly) { window.Calendly.initPopupWidget({ url: getCalendlyUrl('https://calendly.com/premiumchimneys/inspection') }); } }}>
                Book Appointment
              </button>
              <a href={`tel:${city.phone}`} className="footer-btn-phone">{`
                ${city.phone_text}
              `}</a>
            </div>
          </div>
      
          <hr className="footer-divider" />
      
          <div className="footer-bottom">
            <p className="footer-copyright">Copyright &copy; 2025 Premium Chimneys LLC</p>
      
            <div className="footer-bottom-right">
              <div className="footer-links">
                <a href="https://docs.google.com/document/u/1/d/e/2PACX-1vTrfTxjbL0tIWJyFueXXAApR-iosr4xp-2aduiR9fKH6mIn5jacQlnb-LDhwfl3SSrXSG3LTi0DhaJJ/pub" className="footer-link" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                <a href="https://docs.google.com/document/u/1/d/e/2PACX-1vQqV2Hdakj0GwLotRM2It8GgRA47UglnWjEdPHHYQkLCKwI0G0qyeu4yunB6JC4ddar8zjv6noTszYi/pub" className="footer-link" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
              </div>
      
              <div className="footer-socials">
                {/* Facebook */}
                <a href="https://www.facebook.com/premiumchimneys/" target="_blank" rel="noopener noreferrer">
                  <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a href="https://x.com/PremiumChimneys" target="_blank" rel="noopener noreferrer">
                  <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/premiumchimneys/" target="_blank" rel="noopener noreferrer">
                  <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
