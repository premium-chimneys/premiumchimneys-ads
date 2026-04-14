
'use client';
import { useEffect } from 'react';

export default function Coupons({ city }) {
  useEffect(() => {
    // ---- script block ----
    try {
      var coupons = [
          { icon:'\u{1F9F9}', amount:'$49',  service:'Chimney Sweeps', code:'SWEEP49',  desc:'Save $49 on your next professional chimney sweep service.', gradient:'linear-gradient(135deg,#7c3aed,#6d28d9)' },
          { icon:'\u{1F527}', amount:'10%',  service:'All Repairs',    code:'REPAIR10', desc:'Get 10% off any chimney repair service we offer.',         gradient:'linear-gradient(135deg,#9b5de5,#7c3aed)' },
          { icon:'\u{1F3E0}', amount:'$149', service:'Chimney Caps',   code:'CAP149',   desc:'Save $149 on a new chimney cap installation.',            gradient:'linear-gradient(135deg,#6d28d9,#5b21b6)' }
        ];
      
        var savedScrollY = 0;
      
        function cpOpen(i) {
          var c = coupons[i];
          document.getElementById('cpModalIcon').textContent    = c.icon;
          document.getElementById('cpModalAmount').textContent  = c.amount;
          document.getElementById('cpModalService').textContent = c.service;
          document.getElementById('cpModalCode').textContent    = c.code;
          document.getElementById('cpModalDesc').textContent    = c.desc;
          document.getElementById('cpModalTop').style.background = c.gradient;
      
          savedScrollY = window.scrollY;
          document.body.style.position = 'fixed';
          document.body.style.top = '-' + savedScrollY + 'px';
          document.body.style.left = '0';
          document.body.style.right = '0';
      
          document.getElementById('cpOverlay').classList.add('cp-active');
        }
      
        function cpClose(e) {
          if (e && e.target.closest('.cp-modal-card')) return;
          document.getElementById('cpOverlay').classList.remove('cp-active');
      
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          window.scrollTo(0, savedScrollY);
        }
    } catch (e) { console.error('[component script]', e); }
  }, []);
  return (
    <>
      ) &#123;
        return <div></div>
      &#125;
      
      
      
      
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Coupons Section</title>
      
      <style dangerouslySetInnerHTML={{__html: `
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      
        /* ── Keyframes ── */
        @keyframes couponFloat{
          0%,100%{transform:translateY(0) rotate(var(--rot))}
          50%{transform:translateY(-8px) rotate(var(--rot))}
        }
        @keyframes scissorSnip{
          0%,100%{transform:rotate(0deg)}
          25%{transform:rotate(-8deg)}
          75%{transform:rotate(8deg)}
        }
        @keyframes badgeShine{
          0%{opacity:0;left:-50%}
          40%{opacity:.6}
          100%{opacity:0;left:150%}
        }
        @keyframes followTrail{
          0%{offset-distance:0%;opacity:0}
          5%{opacity:1}
          90%{opacity:1;offset-distance:100%}
          91%{opacity:0;offset-distance:100%}
          100%{opacity:0;offset-distance:0%}
        }
        @keyframes overlayIn{from{opacity:0}to{opacity:1}}
        @keyframes modalIn{from{opacity:0;transform:translateY(30px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes caseReveal{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
      
        /* ── Section ── */
        .cp-section{
          background:#faf9fe;
          padding:0 48px 80px;
          font-family:'Inter Tight',sans-serif;
        }
        .cp-container{
          max-width:1200px;
          margin:0 auto;
        }
      
        /* ── Trail ── */
        .cp-trail{
          display:flex;
          justify-content:center;
          padding-bottom:40px;
        }
        .cp-trail-wrap{
          position:relative;
          width:200px;
          height:220px;
        }
        .cp-trail-svg{
          position:absolute;
          inset:0;
          width:200px;
          height:220px;
        }
        .cp-trail-dot{
          position:absolute;
          width:10px;
          height:10px;
          background:#7c3aed;
          border-radius:50%;
          box-shadow:0 0 12px 4px rgba(124,58,237,.45);
          offset-path:path('M100 0 C100 40,160 50,160 80 C160 110,40 120,40 150 C40 180,100 190,100 220');
          animation:followTrail 4s ease-in-out infinite;
        }
        .cp-trail-arrow{
          position:absolute;
          bottom:0;
          left:50%;
          transform:translateX(-50%);
        }
        .cp-trail-text{
          position:absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          font-size:17px;
          font-weight:700;
          color:#7c3aed;
          text-align:center;
          white-space:nowrap;
          pointer-events:none;
        }
      
        /* ── Grid ── */
        .cp-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:24px;
          margin-bottom:56px;
        }
      
        /* ── Coupon Card ── */
        .cp-card{
          --rot:0deg;
          position:relative;
          background:#fff;
          border:2px dashed #7c3aed;
          border-radius:18px;
          box-shadow:0 4px 24px rgba(124,58,237,.12);
          cursor:pointer;
          animation:couponFloat 5s ease-in-out infinite;
          transition:transform .25s,box-shadow .25s;
          overflow:hidden;
        }
        .cp-card:hover{
          transform:scale(1.04) rotate(var(--rot))!important;
          box-shadow:0 8px 36px rgba(124,58,237,.22);
        }
      
        /* Perforated cutouts */
        .cp-card::before,
        .cp-card::after{
          content:'';
          position:absolute;
          width:22px;
          height:22px;
          background:#faf9fe;
          border-radius:50%;
          top:50%;
          transform:translateY(-50%);
          z-index:2;
          box-shadow:inset 0 0 0 2px #7c3aed;
        }
        .cp-card::before{left:-12px}
        .cp-card::after{right:-12px}
      
        /* Top gradient */
        .cp-card-top{
          position:relative;
          padding:28px 20px 22px;
          text-align:center;
          color:#fff;
          overflow:hidden;
        }
        .cp-card-top::after{
          content:'';
          position:absolute;
          inset:0;
          background:radial-gradient(circle at 20% 30%,rgba(255,255,255,.12) 1px,transparent 1px),
                     radial-gradient(circle at 80% 70%,rgba(255,255,255,.12) 1px,transparent 1px),
                     radial-gradient(circle at 50% 50%,rgba(255,255,255,.08) 1px,transparent 1px);
          background-size:24px 24px,30px 30px,18px 18px;
          pointer-events:none;
        }
        .cp-card-icon{font-size:36px;display:block;margin-bottom:6px}
        .cp-card-amount{font-size:64px;font-weight:800;line-height:1}
        .cp-card-off{font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:2px;opacity:.85}
        .cp-card-service{font-size:16px;font-weight:600;margin-top:4px;opacity:.9}
      
        /* Shine sweep */
        .cp-card-shine{
          position:absolute;
          top:0;
          width:60%;
          height:100%;
          background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%);
          animation:badgeShine 4s ease-in-out infinite;
          pointer-events:none;
        }
      
        /* Separator */
        .cp-card-sep{
          border:none;
          border-top:2px dashed #e2d5f7;
          margin:0 20px;
        }
      
        /* Bottom */
        .cp-card-bottom{
          padding:18px 20px 22px;
          text-align:center;
        }
        .cp-card-desc{
          font-size:14px;
          color:#555;
          margin-bottom:12px;
          line-height:1.45;
        }
        .cp-card-code-wrap{
          display:inline-flex;
          align-items:center;
          gap:8px;
        }
        .cp-card-code{
          display:inline-block;
          padding:6px 16px;
          border:2px dashed #7c3aed;
          border-radius:8px;
          font-family:'Courier New',monospace;
          font-size:16px;
          font-weight:700;
          color:#7c3aed;
          letter-spacing:1.5px;
          background:rgba(124,58,237,.04);
        }
        .cp-card-scissors{
          font-size:20px;
          animation:scissorSnip 1.8s ease-in-out infinite;
          display:inline-block;
        }
      
        /* ── Modal ── */
        .cp-overlay{
          display:none;
          position:fixed;
          inset:0;
          z-index:9999;
          background:rgba(30,10,60,.72);
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
          justify-content:center;
          align-items:center;
          flex-direction:column;
          animation:overlayIn .3s ease;
          cursor:pointer;
        }
        .cp-overlay.cp-active{display:flex}
      
        .cp-modal-greeting{
          font-size:36px;
          font-weight:700;
          color:#fff;
          margin-bottom:6px;
          animation:modalIn .45s ease both;
        }
        .cp-modal-sub{
          font-size:18px;
          color:rgba(255,255,255,.7);
          margin-bottom:28px;
          animation:modalIn .45s ease .08s both;
        }
      
        .cp-modal-card{
          position:relative;
          width:400px;
          max-width:92vw;
          background:#fff;
          border:2px dashed #7c3aed;
          border-radius:22px;
          box-shadow:0 12px 48px rgba(124,58,237,.25);
          overflow:hidden;
          cursor:default;
          animation:modalIn .5s ease .12s both;
        }
        .cp-modal-card::before,
        .cp-modal-card::after{
          content:'';
          position:absolute;
          width:26px;
          height:26px;
          background:rgba(30,10,60,.72);
          border-radius:50%;
          top:50%;
          transform:translateY(-50%);
          z-index:2;
          box-shadow:inset 0 0 0 2px #7c3aed;
        }
        .cp-modal-card::before{left:-14px}
        .cp-modal-card::after{right:-14px}
      
        .cp-modal-top{
          position:relative;
          padding:32px 24px 26px;
          text-align:center;
          color:#fff;
          overflow:hidden;
        }
        .cp-modal-top::after{
          content:'';
          position:absolute;
          inset:0;
          background:radial-gradient(circle at 20% 30%,rgba(255,255,255,.12) 1px,transparent 1px),
                     radial-gradient(circle at 80% 70%,rgba(255,255,255,.12) 1px,transparent 1px),
                     radial-gradient(circle at 50% 50%,rgba(255,255,255,.08) 1px,transparent 1px);
          background-size:24px 24px,30px 30px,18px 18px;
          pointer-events:none;
        }
        .cp-modal-icon{font-size:52px;display:block;margin-bottom:8px}
        .cp-modal-amount{font-size:80px;font-weight:800;line-height:1}
        .cp-modal-off{font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:2px;opacity:.85}
        .cp-modal-service{font-size:18px;font-weight:600;margin-top:6px;opacity:.9}
        .cp-modal-shine{
          position:absolute;
          top:0;
          width:60%;
          height:100%;
          background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%);
          animation:badgeShine 4s ease-in-out infinite;
          pointer-events:none;
        }
      
        .cp-modal-sep{
          border:none;
          border-top:2px dashed #e2d5f7;
          margin:0 24px;
        }
      
        .cp-modal-bottom{
          padding:22px 24px 28px;
          text-align:center;
        }
        .cp-modal-desc{
          font-size:15px;
          color:#555;
          margin-bottom:16px;
          line-height:1.5;
        }
        .cp-modal-code{
          display:inline-block;
          padding:10px 28px;
          border:2px dashed #7c3aed;
          border-radius:10px;
          font-family:'Courier New',monospace;
          font-size:22px;
          font-weight:700;
          color:#7c3aed;
          letter-spacing:2px;
          background:rgba(124,58,237,.04);
          margin-bottom:20px;
        }
        .cp-modal-btn{
          display:inline-block;
          padding:14px 36px;
          background:linear-gradient(135deg,#7c3aed,#6d28d9);
          color:#fff;
          font-family:'Inter Tight',sans-serif;
          font-size:17px;
          font-weight:700;
          border:none;
          border-radius:50px;
          text-decoration:none;
          cursor:pointer;
          transition:transform .2s,box-shadow .2s;
          box-shadow:0 4px 18px rgba(124,58,237,.3);
        }
        .cp-modal-btn:hover{
          transform:translateY(-2px);
          box-shadow:0 6px 24px rgba(124,58,237,.4);
        }
      
        .cp-modal-hint{
          margin-top:20px;
          font-size:14px;
          color:rgba(255,255,255,.5);
          animation:modalIn .45s ease .2s both;
        }
      
        /* ── CTA ── */
        .cp-cta{
          text-align:center;
          padding-top:8px;
        }
        .cp-cta-text{
          font-size:16px;
          color:#666;
          margin-bottom:16px;
        }
        .cp-cta-btn{
          display:inline-block;
          padding:16px 40px;
          background:linear-gradient(135deg,#7c3aed,#6d28d9);
          color:#fff;
          font-family:'Inter Tight',sans-serif;
          font-size:18px;
          font-weight:700;
          border:none;
          border-radius:50px;
          text-decoration:none;
          cursor:pointer;
          transition:transform .2s,box-shadow .2s;
          box-shadow:0 4px 20px rgba(124,58,237,.3);
        }
        .cp-cta-btn:hover{
          transform:translateY(-2px);
          box-shadow:0 8px 28px rgba(124,58,237,.4);
        }
      
        /* ── Responsive ── */
        @media(max-width:960px){
          .cp-grid{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:600px){
          .cp-section{padding:0 20px 60px}
          .cp-grid{grid-template-columns:1fr}
          .cp-card-amount{font-size:52px}
          .cp-modal-amount{font-size:64px}
          .cp-modal-card{width:340px}
        }
      `}} />
      
      
      
      <section className="cp-section">
        <div className="cp-container">
      
          {/* Trail */}
          <div className="cp-trail">
            <div className="cp-trail-wrap">
              <svg className="cp-trail-svg" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 0 C100 40,160 50,160 80 C160 110,40 120,40 150 C40 180,100 190,100 220" stroke="#7c3aed" strokeWidth="2" strokeDasharray="8 8" opacity="0.2" fill="none" />
              </svg>
              <div className="cp-trail-dot"></div>
              <svg className="cp-trail-arrow" width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg">
                <polygon points="10,14 0,0 20,0" fill="#7c3aed" opacity="0.5" />
              </svg>
              <span className="cp-trail-text">Now pick one to get started</span>
            </div>
          </div>
      
          {/* Coupon Grid */}
          <div className="cp-grid">
      
            {/* Card 1 */}
            <div className="cp-card" style={{ '-Rot': '-2deg', animationDelay: '0s' }} onclick="cpOpen(0)">
              <div className="cp-card-top" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                <div className="cp-card-shine"></div>
                <span className="cp-card-icon">&#x1f9f9;</span>
                <div className="cp-card-amount">$49</div>
                <div className="cp-card-off">OFF</div>
                <div className="cp-card-service">Chimney Sweeps</div>
              </div>
              <hr className="cp-card-sep" />
              <div className="cp-card-bottom">
                <p className="cp-card-desc">Save $49 on your next professional chimney sweep service.</p>
                <div className="cp-card-code-wrap">
                  <span className="cp-card-code">SWEEP49</span>
                  <span className="cp-card-scissors">&#x2702;&#xFE0F;</span>
                </div>
              </div>
            </div>
      
            {/* Card 2 */}
            <div className="cp-card" style={{ '-Rot': '1deg', animationDelay: '.6s' }} onclick="cpOpen(1)">
              <div className="cp-card-top" style={{ background: 'linear-gradient(135deg,#9b5de5,#7c3aed)' }}>
                <div className="cp-card-shine"></div>
                <span className="cp-card-icon">&#x1f527;</span>
                <div className="cp-card-amount">10%</div>
                <div className="cp-card-off">OFF</div>
                <div className="cp-card-service">All Repairs</div>
              </div>
              <hr className="cp-card-sep" />
              <div className="cp-card-bottom">
                <p className="cp-card-desc">Get 10% off any chimney repair service we offer.</p>
                <div className="cp-card-code-wrap">
                  <span className="cp-card-code">REPAIR10</span>
                  <span className="cp-card-scissors">&#x2702;&#xFE0F;</span>
                </div>
              </div>
            </div>
      
            {/* Card 3 */}
            <div className="cp-card" style={{ '-Rot': '-1deg', animationDelay: '1.2s' }} onclick="cpOpen(2)">
              <div className="cp-card-top" style={{ background: 'linear-gradient(135deg,#6d28d9,#5b21b6)' }}>
                <div className="cp-card-shine"></div>
                <span className="cp-card-icon">&#x1f3e0;</span>
                <div className="cp-card-amount">$149</div>
                <div className="cp-card-off">OFF</div>
                <div className="cp-card-service">Chimney Caps</div>
              </div>
              <hr className="cp-card-sep" />
              <div className="cp-card-bottom">
                <p className="cp-card-desc">Save $149 on a new chimney cap installation.</p>
                <div className="cp-card-code-wrap">
                  <span className="cp-card-code">CAP149</span>
                  <span className="cp-card-scissors">&#x2702;&#xFE0F;</span>
                </div>
              </div>
            </div>
      
          </div>
      
          {/* CTA */}
          <div className="cp-cta">
            <p className="cp-cta-text">Mention your coupon code when you call to redeem.</p>
            <a href={`tel:${city.phone}`} className="cp-cta-btn">{`Call to Redeem: ${city.phone_text}`}</a>
          </div>
      
        </div>
      </section>
      
      {/* Modal Overlay */}
      <div className="cp-overlay" id="cpOverlay" onclick="cpClose(event)">
        <div className="cp-modal-greeting">Um.. hello there &#x1f44b;</div>
        <div className="cp-modal-sub">I'm just a coupon. Please redeem me.</div>
      
        <div className="cp-modal-card" id="cpModalCard" onclick="event.stopPropagation()">
          <div className="cp-modal-top" id="cpModalTop">
            <div className="cp-modal-shine"></div>
            <span className="cp-modal-icon" id="cpModalIcon"></span>
            <div className="cp-modal-amount" id="cpModalAmount"></div>
            <div className="cp-modal-off">OFF</div>
            <div className="cp-modal-service" id="cpModalService"></div>
          </div>
          <hr className="cp-modal-sep" />
          <div className="cp-modal-bottom">
            <p className="cp-modal-desc" id="cpModalDesc"></p>
            <div className="cp-modal-code" id="cpModalCode"></div>
            <br />
            <a href={`tel:${city.phone}`} className="cp-modal-btn">Redeem Now</a>
          </div>
        </div>
      
        <div className="cp-modal-hint">Tap anywhere to close</div>
      </div>
    </>
  );
}
