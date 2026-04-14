
'use client';
import { useEffect } from 'react';

export default function FAQ({ city }) {
  useEffect(() => {
    // ---- script block ----
    try {
      (function() {
        var faqBtns = document.querySelectorAll('.cs-faq-q');
        faqBtns.forEach(function(btn) {
          btn.addEventListener('click', function() {
            var idx = btn.getAttribute('data-faq');
            var answer = document.querySelector('[data-faq-a="' + idx + '"]');
            var isOpen = btn.classList.contains('active');
      
            faqBtns.forEach(function(b) { b.classList.remove('active'); });
            document.querySelectorAll('.cs-faq-a').forEach(function(a) { a.classList.remove('open'); });
      
            if (!isOpen) {
              btn.classList.add('active');
              answer.classList.add('open');
            }
          });
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
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap');
      
        .cs-faq * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes faqPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
      
        .cs-faq { background: #0a0a0a; padding: 0 48px 120px; position: relative; font-family: 'DM Sans', sans-serif; }
        .cs-faq-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 380px 1fr; gap: 80px; align-items: start; }
        .cs-faq-left { position: sticky; top: 140px; }
        .cs-faq-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.25); border-radius: 100px; padding: 6px 16px; margin-bottom: 20px; }
        .cs-faq-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #a78bfa; animation: faqPulse 2s ease-in-out infinite; }
        .cs-faq-eyebrow-text { font-size: 12px; font-weight: 600; color: #a78bfa; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'Inter Tight', sans-serif; }
        .cs-faq-h2 { font-family: 'Inter Tight', sans-serif; font-size: 40px; font-weight: 900; color: #fff; letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 16px; }
        .cs-faq-h2-accent { color: #a78bfa; }
        .cs-faq-desc { font-size: 15px; color: rgba(255,255,255,0.4); line-height: 1.7; font-weight: 300; margin-bottom: 0; }
        .cs-faq-quote { margin-top: 32px; padding: 24px; border-radius: 16px; background: rgba(124,58,237,0.06); border: 1px solid rgba(124,58,237,0.12); }
        .cs-faq-quote-text { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 500; font-style: italic; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 16px; letter-spacing: 0.01em; }
        .cs-faq-quote-author { display: flex; align-items: center; gap: 12px; }
        .cs-faq-quote-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(124,58,237,0.3); }
        .cs-faq-quote-name { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }
        .cs-faq-quote-role { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 500; color: #a78bfa; }
      
        .cs-faq-list { display: flex; flex-direction: column; gap: 0; }
        .cs-faq-item { border-bottom: 1px solid rgba(255,255,255,0.06); }
        .cs-faq-item:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
        .cs-faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 24px 0; background: none; border: none; cursor: pointer; text-align: left; gap: 20px; font-family: inherit; }
        .cs-faq-q-text { font-family: 'Inter Tight', sans-serif; font-size: 16px; font-weight: 600; color: #fff; letter-spacing: -0.01em; transition: color 0.2s; }
        .cs-faq-q.active .cs-faq-q-text { color: #a78bfa; }
        .cs-faq-q-icon { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); background: rgba(255,255,255,0.05); }
        .cs-faq-q.active .cs-faq-q-icon { background: #7c3aed; transform: rotate(45deg); }
        .cs-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; opacity: 0; }
        .cs-faq-a.open { max-height: 200px; opacity: 1; }
        .cs-faq-a-inner { padding: 0 0 24px; font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.8; font-weight: 300; max-width: 90%; font-family: 'Inter Tight', sans-serif; }
      
        @media (max-width: 960px) {
          .cs-faq-inner { grid-template-columns: 1fr !important; gap: 40px !important; }
          .cs-faq-left { position: static !important; }
          .cs-faq { padding: 80px 24px !important; }
          .cs-faq-h2 { font-size: 32px !important; }
        }
      
        @media (max-width: 600px) {
          .cs-faq { padding: 60px 20px !important; }
        }
      `}} />
      
      <section className="cs-faq">
        <div className="cs-faq-inner">
          {/* Left — sticky */}
          <div className="cs-faq-left">
            <div className="cs-faq-eyebrow">
              <div className="cs-faq-eyebrow-dot"></div>
              <span className="cs-faq-eyebrow-text">FAQ</span>
            </div>
            <h2 className="cs-faq-h2">Questions? <span className="cs-faq-h2-accent">We've got answers.</span></h2>
            <p className="cs-faq-desc">The most common things homeowners ask us before booking their first inspection.</p>
      
            <div className="cs-faq-quote">
              <p className="cs-faq-quote-text">"Your questions matter to us. We want you informed, confident, and part of every step, from the first call to the final report."</p>
              <div className="cs-faq-quote-author">
                <img className="cs-faq-quote-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/6949ae8b2c8046d0db5c5439_arin-premium-chimneys-leadership-team.webp" alt="Arin Glimm" />
                <div>
                  <div className="cs-faq-quote-name">Arin Glimm</div>
                  <div className="cs-faq-quote-role">Founder, Premium Chimneys</div>
                </div>
              </div>
            </div>
          </div>
      
          {/* Right — accordion */}
          <div className="cs-faq-list" id="csFaqList">
            <div className="cs-faq-item">
              <button className="cs-faq-q" data-faq="0">
                <span className="cs-faq-q-text">How often should I get my chimney cleaned?</span>
                <div className="cs-faq-q-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></div>
              </button>
              <div className="cs-faq-a" data-faq-a="0">
                <div className="cs-faq-a-inner">The National Fire Protection Association recommends a chimney cleaning at least once a year. Regular chimney sweeps help prevent creosote buildup, reduce fire risk, and keep your fireplace running efficiently.</div>
              </div>
            </div>
            <div className="cs-faq-item">
              <button className="cs-faq-q" data-faq="1">
                <span className="cs-faq-q-text">What's included in a professional chimney sweep?</span>
                <div className="cs-faq-q-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></div>
              </button>
              <div className="cs-faq-a" data-faq-a="1">
                <div className="cs-faq-a-inner">A chimney sweep includes removing soot and creosote, inspecting for damage or blockages, and ensuring proper airflow. At Premium Chimneys, we also check the flue, crown, and cap to keep your system safe and compliant.</div>
              </div>
            </div>
            <div className="cs-faq-item">
              <button className="cs-faq-q" data-faq="2">
                <span className="cs-faq-q-text">Do I need a chimney cap on my fireplace?</span>
                <div className="cs-faq-q-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></div>
              </button>
              <div className="cs-faq-a" data-faq-a="2">
                <div className="cs-faq-a-inner">Yes. Chimney caps keep out rain, animals, and debris — all of which can cause serious damage. They also help prevent downdrafts and improve ventilation.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
