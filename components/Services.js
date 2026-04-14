
'use client';
import { useEffect } from 'react';
import { getCalendlyUrl } from '@/lib/useCalendlyTracking';

export default function Services({ city }) {
  useEffect(() => {
    // ---- script block ----
    try {
      (function() {
        var offers = [
          { emoji: '🔍', title: 'Free Inspection', desc: 'A full chimney or fireplace inspection — on us.', code: 'FREEINSPECT25' },
          { emoji: '🧹', title: '$69 Off Sweep', desc: '$69 off any chimney sweep service.', code: 'SWEEP69OFF' },
          { emoji: '🔧', title: '15% Off Repairs', desc: '15% off any chimney or fireplace repair.', code: 'REPAIR15' }
        ];
      
        var claimed = false;
        var pickedIndex = null;
        var overlay = document.getElementById('giftOverlay');
        var claimBtn = document.getElementById('claimOfferBtn');
        var closeBtn = document.getElementById('giftClose');
        var boxes = document.querySelectorAll('.sv1-gift-box');
        var pickState = document.getElementById('giftPickState');
        var revealState = document.getElementById('giftRevealState');
        var copyBtn = document.getElementById('copyCodeBtn');
      
        function openModal() {
          if (claimed) { showReveal(pickedIndex); }
          else {
            pickState.style.display = '';
            revealState.style.display = 'none';
            document.getElementById('giftTitle').textContent = 'Pick Your Gift';
            document.getElementById('giftSubtitle').textContent = 'Choose one of three mystery gifts below. Each one contains an exclusive offer.';
            boxes.forEach(function(b) { b.className = 'sv1-gift-box'; });
          }
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      
        function closeModal() { overlay.classList.remove('active'); document.body.style.overflow = ''; }
      
        function showReveal(index) {
          pickState.style.display = 'none';
          revealState.style.display = '';
          document.getElementById('revealEmoji').textContent = offers[index].emoji;
          document.getElementById('revealTitle').textContent = offers[index].title;
          document.getElementById('revealDesc').textContent = offers[index].desc;
          document.getElementById('revealCode').textContent = offers[index].code;
          var confetti = document.getElementById('giftConfetti');
          confetti.innerHTML = '';
          var colors = ['#7c3aed','#a78bfa','#c084fc','#c2855a','#d4a574','#22c55e','#fff'];
          for (var i = 0; i < 20; i++) {
            var angle = (i / 20) * 360, dist = 80 + Math.random() * 120;
            var x = Math.cos(angle * Math.PI / 180) * dist, y = Math.sin(angle * Math.PI / 180) * dist;
            var span = document.createElement('span'), size = 4 + Math.random() * 6;
            span.style.cssText = 'background:' + colors[Math.floor(Math.random() * colors.length)] + ';width:' + size + 'px;height:' + size + 'px;animation-delay:' + (Math.random() * .4) + 's;animation-duration:' + (.8 + Math.random() * .6) + 's;--x:' + x + 'px;--y:' + y + 'px';
            confetti.appendChild(span);
          }
        }
      
        function pickGift(index) {
          if (claimed) return;
          pickedIndex = index;
          document.getElementById('giftTitle').textContent = '✨ Revealing your offer...';
          document.getElementById('giftSubtitle').textContent = 'Hold tight — your exclusive deal is being selected.';
          boxes.forEach(function(b, i) {
            b.classList.add('picked');
            if (i === index) b.classList.add('chosen', 'shuffling');
            else b.classList.add('not-chosen', 'shuffling');
          });
          setTimeout(function() { claimed = true; showReveal(index); }, 1800);
        }
      
        if (claimBtn) claimBtn.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
        boxes.forEach(function(box) { box.addEventListener('click', function() { pickGift(parseInt(box.dataset.index)); }); });
        if (copyBtn) copyBtn.addEventListener('click', function() {
          if (pickedIndex === null) return;
          navigator.clipboard.writeText(offers[pickedIndex].code);
          copyBtn.textContent = '✓ Copied'; copyBtn.classList.add('copied');
          setTimeout(function() { copyBtn.textContent = 'Copy Code'; copyBtn.classList.remove('copied'); }, 2000);
        });
      
        var ctaBtn = document.getElementById('servicesCtaBtn');
        if (ctaBtn) {
          ctaBtn.addEventListener('click', function() {
            var url = getCalendlyUrl('https://calendly.com/premiumchimneys/inspection');
            function open() { if (window.Calendly) window.Calendly.initPopupWidget({ url: url }); }
            if (window.Calendly) { open(); }
            else {
              var t = setInterval(function() { if (window.Calendly) { clearInterval(t); open(); } }, 100);
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
        .sv1{background:#f5f5f7;padding:120px 0;font-family:'Inter Tight',sans-serif;position:relative;overflow:hidden}
        .sv1::before,.sv1::after{content:'';position:absolute;border-radius:50%;pointer-events:none}
        .sv1::before{top:-100px;left:10%;width:900px;height:900px;background:radial-gradient(ellipse,rgba(124,58,237,.25) 0%,rgba(124,58,237,.1) 30%,transparent 60%);animation:sv1F1 5s ease-in-out infinite}
        .sv1::after{bottom:-50px;right:5%;width:800px;height:800px;background:radial-gradient(ellipse,rgba(167,139,250,.22) 0%,rgba(167,139,250,.08) 30%,transparent 60%);animation:sv1F2 7s ease-in-out infinite}
        @keyframes sv1F1{0%{transform:translate(0,0) scale(1)}25%{transform:translate(80px,50px) scale(1.15)}50%{transform:translate(-40px,100px) scale(.95)}75%{transform:translate(-80px,30px) scale(1.1)}100%{transform:translate(0,0) scale(1)}}
        @keyframes sv1F2{0%{transform:translate(0,0) scale(1)}25%{transform:translate(-60px,-40px) scale(1.2)}50%{transform:translate(50px,-80px) scale(.9)}75%{transform:translate(70px,20px) scale(1.1)}100%{transform:translate(0,0) scale(1)}}
        .sv1-inner{max-width:1200px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
        .sv1-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:56px;gap:24px}
        .sv1-header-left{max-width:600px}
        .sv1-eyebrow{display:inline-flex;align-items:center;gap:8px;margin-bottom:24px;padding:6px 14px 6px 12px;border-radius:8px;background:linear-gradient(135deg,#0e0b14 0%,#241548 50%,#3b1f6e 100%);border:1px solid rgba(124,58,237,.15);box-shadow:0 0 20px rgba(124,58,237,.2),inset 0 0 12px rgba(124,58,237,.1)}
        .sv1-eyebrow-dot{width:5px;height:5px;border-radius:50%;background:#a78bfa;flex-shrink:0;animation:sv1DP 2s ease-in-out infinite}
        @keyframes sv1DP{0%,100%{box-shadow:0 0 4px rgba(167,139,250,.5)}50%{box-shadow:0 0 12px rgba(167,139,250,.9),0 0 24px rgba(124,58,237,.3)}}
        .sv1-eyebrow-text{font-size:12px;font-weight:600;color:#fff;letter-spacing:.04em}
        .sv1-title{font-size:48px;font-weight:600;color:#1a1225;letter-spacing:-.04em;line-height:1.08;margin:0}
        .sv1-title-gradient{background:linear-gradient(135deg,#c2855a 0%,#d4a574 40%,#8b5c34 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sv1-header-right{max-width:340px;flex-shrink:0}
        .sv1-subtitle{font-size:15px;font-weight:400;color:#7c6f94;line-height:1.65;margin:0 0 16px}
        .sv1-header-cta{display:inline-flex;align-items:center;gap:8px;font-family:'Inter Tight',sans-serif;font-size:14px;font-weight:600;color:#f0e0fd;text-decoration:none;padding:11px 22px;border-radius:10px;border:1px solid #7c3aed;background:linear-gradient(160deg,#9b5de5,#7c3aed 25%,#5b21b6 50%,#6d28d9 72%,#8b5cf6);box-shadow:inset 0 1px 0 rgba(196,155,240,.55),inset 0 -1px 0 rgba(0,0,0,.22),0 4px 14px rgba(91,33,182,.4);transition:all .22s ease;position:relative;overflow:hidden;cursor:pointer;text-shadow:0 1px 2px rgba(45,15,80,.35)}
        .sv1-header-cta::before{content:'';position:absolute;top:0;left:-70%;width:40%;height:100%;background:linear-gradient(105deg,transparent 35%,rgba(210,175,255,.35) 50%,transparent 65%);transform:skewX(-12deg);pointer-events:none;transition:left .55s ease}
        .sv1-header-cta:hover{transform:translateY(-2px);box-shadow:inset 0 1px 0 rgba(196,155,240,.55),inset 0 -1px 0 rgba(0,0,0,.22),0 8px 22px rgba(91,33,182,.5);border-color:#8b5cf6}
        .sv1-header-cta:hover::before{left:130%}
        .sv1-header-cta svg{transition:transform .25s ease}
        .sv1-header-cta:hover svg{transform:scale(1.1)}
        .sv1-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
      
        /* CARD — full bleed image */
        .sv1-card{border-radius:16px;overflow:hidden;position:relative;transition:all .4s cubic-bezier(.16,1,.3,1);text-decoration:none;display:flex;flex-direction:column;height:380px}
        .sv1-card:hover{transform:translateY(-8px);box-shadow:0 20px 40px rgba(0,0,0,.2)}
        .sv1-card-img-wrap{position:absolute;inset:0;z-index:0}
        .sv1-card-img{width:100%;height:100%;object-fit:cover;transition:all .6s cubic-bezier(.16,1,.3,1);filter:saturate(1.1) contrast(1.05)}
        .sv1-card:hover .sv1-card-img{transform:scale(1.08);filter:saturate(1.2) contrast(1.1) brightness(1.02)}
        .sv1-card-img-wrap::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.08) 50%,rgba(0,0,0,.4) 100%);z-index:1;pointer-events:none}
      
        /* icon — metallic copper */
        .sv1-card-icon{width:44px;height:44px;border-radius:14px;background:linear-gradient(160deg,#d4854a,#b86028 25%,#8b3c14 50%,#a04c1e 72%,#cc7535);border:1px solid #c06828;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;overflow:hidden;transition:all .3s ease;box-shadow:inset 0 1px 0 rgba(240,175,110,.5),inset 0 -1px 0 rgba(0,0,0,.2),0 2px 8px rgba(140,60,18,.25)}
        .sv1-card-icon::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(105deg,transparent 40%,rgba(255,210,155,.3) 50%,transparent 60%);transform:skewX(-15deg);pointer-events:none;animation:sv1IG 5s ease-in-out infinite;z-index:2}
        @keyframes sv1IG{0%{left:-100%}40%{left:150%}100%{left:150%}}
        .sv1-card:hover .sv1-card-icon{box-shadow:inset 0 1px 0 rgba(240,175,110,.5),inset 0 -1px 0 rgba(0,0,0,.2),0 4px 20px rgba(140,60,18,.4);transform:scale(1.05)}
        .sv1-card-icon lottie-player{position:relative;z-index:1;filter:brightness(0) invert(1)}
      
        /* body — glassmorphic */
        .sv1-card-body{margin-top:auto;margin:auto 10px 10px;padding:16px 18px;min-height:140px;position:relative;z-index:2;display:flex;flex-direction:column;gap:8px;background:rgba(0,0,0,.35);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-radius:12px;border:1px solid rgba(255,255,255,.1)}
        .sv1-card-header{display:flex;align-items:center;gap:12px}
        .sv1-card-title{font-size:15px;font-weight:700;color:#fff;margin:0;letter-spacing:-.01em;text-shadow:0 1px 3px rgba(0,0,0,.3)}
        .sv1-card-desc{font-size:12.5px;font-weight:400;color:rgba(255,255,255,.75);line-height:1.5;margin:0;text-shadow:0 1px 2px rgba(0,0,0,.2);min-height:38px}
        .sv1-card-link{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:rgba(255,255,255,.9);text-decoration:none;transition:all .25s ease;width:fit-content}
        .sv1-card-link:hover{color:#fff}
        .sv1-card-link svg{transition:transform .25s ease}
        .sv1-card:hover .sv1-card-link svg{transform:translateX(4px)}
      
        /* CTA BANNER */
        .sv1-cta{margin-top:16px;border-radius:20px;background:linear-gradient(135deg,#0e0b14,#1a1030 50%,#0e0b14);border:1px solid rgba(124,58,237,.2);display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:0;position:relative;overflow:hidden;transition:all .3s ease}
        .sv1-cta:hover{border-color:rgba(124,58,237,.4);box-shadow:0 16px 48px rgba(124,58,237,.12),0 0 80px rgba(124,58,237,.04)}
        .sv1-cta::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#7c3aed,#a78bfa,#c084fc,#a78bfa,#7c3aed,transparent);background-size:300% 100%;animation:sv1CA 4s ease-in-out infinite;z-index:2}
        @keyframes sv1CA{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .sv1-cta::after{content:'';position:absolute;left:40px;top:50%;transform:translateY(-50%);width:120px;height:120px;background:radial-gradient(circle,rgba(124,58,237,.2) 0%,transparent 70%);pointer-events:none;z-index:0;animation:sv1CG 3s ease-in-out infinite}
        @keyframes sv1CG{0%,100%{opacity:.6;transform:translateY(-50%) scale(1)}50%{opacity:1;transform:translateY(-50%) scale(1.2)}}
        .sv1-cta-badge{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;flex-shrink:0;padding:32px 36px;position:relative;z-index:1}
        .sv1-cta-badge-label{font-family:'Inter Tight',sans-serif;font-size:10px;font-weight:700;color:#a78bfa;letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px}
        .sv1-cta-badge-amount{font-family:'Inter Tight',sans-serif;font-size:40px;font-weight:800;letter-spacing:-.03em;line-height:1;background:linear-gradient(180deg,#fff 30%,#a78bfa 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sv1-cta-badge-sub{font-family:'Inter Tight',sans-serif;font-size:11px;font-weight:500;color:rgba(255,255,255,.35);margin-top:2px}
        .sv1-cta-content{padding:32px 36px;position:relative;z-index:1}
        .sv1-cta-heading{font-family:'Inter Tight',sans-serif;font-size:20px;font-weight:700;color:#fff;margin:0 0 6px;letter-spacing:-.02em}
        .sv1-cta-desc{font-family:'Inter Tight',sans-serif;font-size:14px;font-weight:400;color:rgba(255,255,255,.45);margin:0 0 16px;line-height:1.5}
        .sv1-cta-features{display:flex;gap:20px}
        .sv1-cta-feature{display:inline-flex;align-items:center;gap:6px;font-family:'Inter Tight',sans-serif;font-size:12px;font-weight:500;color:rgba(255,255,255,.6)}
        .sv1-cta-feature svg{flex-shrink:0}
        .sv1-cta-action{padding:32px 36px;display:flex;flex-direction:column;align-items:center;gap:10px;position:relative;z-index:1}
        .sv1-cta-btn{display:inline-flex;align-items:center;gap:8px;font-family:'Inter Tight',sans-serif;font-size:15px;font-weight:600;color:#f0e0fd;padding:14px 32px;border-radius:12px;border:1px solid #7c3aed;background:linear-gradient(160deg,#9b5de5,#7c3aed 25%,#5b21b6 50%,#6d28d9 72%,#8b5cf6);box-shadow:inset 0 1px 0 rgba(196,155,240,.55),inset 0 -1px 0 rgba(0,0,0,.22),0 4px 20px rgba(91,33,182,.5);transition:all .22s ease;position:relative;overflow:hidden;cursor:pointer;text-shadow:0 1px 2px rgba(45,15,80,.35);text-decoration:none;white-space:nowrap;width:100%;justify-content:center}
        .sv1-cta-btn::before{content:'';position:absolute;top:0;left:-70%;width:40%;height:100%;background:linear-gradient(105deg,transparent 35%,rgba(210,175,255,.35) 50%,transparent 65%);transform:skewX(-12deg);pointer-events:none;transition:left .55s ease}
        .sv1-cta-btn:hover{transform:translateY(-2px);box-shadow:inset 0 1px 0 rgba(196,155,240,.55),inset 0 -1px 0 rgba(0,0,0,.22),0 8px 28px rgba(91,33,182,.6);border-color:#8b5cf6}
        .sv1-cta-btn:hover::before{left:130%}
        .sv1-cta-call{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:'Inter Tight',sans-serif;font-size:14px;font-weight:500;color:rgba(255,255,255,.7);text-decoration:none;padding:12px 24px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);transition:all .22s ease;white-space:nowrap;width:100%}
        .sv1-cta-call:hover{color:#fff;border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.08);transform:translateY(-1px)}
      
        /* GIFT MODAL */
        .sv1-gift-overlay{display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:center;justify-content:center}
        .sv1-gift-overlay.active{display:flex;animation:sv1GF .3s ease-out}
        @keyframes sv1GF{0%{opacity:0}100%{opacity:1}}
        .sv1-gift-modal{background:rgba(255,255,255,.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(124,58,237,.12);border-radius:24px;width:90%;max-width:520px;padding:44px 40px;position:relative;overflow:hidden;text-align:center;animation:sv1GS .4s cubic-bezier(.16,1,.3,1);box-shadow:0 32px 64px rgba(0,0,0,.2),0 0 100px rgba(124,58,237,.06)}
        @keyframes sv1GS{0%{opacity:0;transform:translateY(30px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
        .sv1-gift-modal::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#7c3aed,#a78bfa,#c084fc,#a78bfa,#7c3aed,transparent);background-size:300% 100%;animation:sv1CA 4s ease-in-out infinite;z-index:2}
        .sv1-gift-close{position:absolute;top:16px;right:16px;width:32px;height:32px;border:none;background:rgba(0,0,0,.04);border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:#7c6f94;transition:all .2s ease;z-index:3}
        .sv1-gift-close:hover{background:rgba(0,0,0,.08);color:#1a1225}
        .sv1-gift-title{font-family:'Inter Tight',sans-serif;font-size:24px;font-weight:800;color:#1a1225;margin:0 0 8px;letter-spacing:-.03em}
        .sv1-gift-subtitle{font-family:'Inter Tight',sans-serif;font-size:14px;color:#7c6f94;margin:0 0 32px;line-height:1.5}
        .sv1-gift-boxes{display:flex;gap:16px;justify-content:center;margin-bottom:24px}
        .sv1-gift-box{width:140px;height:160px;border-radius:16px;background:#f8f6fd;border:1.5px solid rgba(124,58,237,.1);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all .3s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
        .sv1-gift-box::before{content:'';position:absolute;inset:-1px;border-radius:16px;background:conic-gradient(from 0deg,rgba(124,58,237,.4),transparent 30%,transparent 70%,rgba(167,139,250,.3));animation:sv1Spin 4s linear infinite;z-index:0;opacity:0;transition:opacity .3s ease}
        .sv1-gift-box::after{content:'';position:absolute;inset:1px;border-radius:15px;background:linear-gradient(160deg,#f8f6fd,#f0ecfa);z-index:0}
        @keyframes sv1Spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        .sv1-gift-box:hover::before{opacity:1}
        .sv1-gift-box:hover{transform:translateY(-6px) scale(1.04);border-color:rgba(124,58,237,.25);box-shadow:0 12px 32px rgba(124,58,237,.12)}
        .sv1-gift-box-emoji{font-size:40px;position:relative;z-index:1;transition:transform .3s ease}
        .sv1-gift-box:hover .sv1-gift-box-emoji{transform:scale(1.15) rotate(-5deg)}
        .sv1-gift-box-label{font-family:'Inter Tight',sans-serif;font-size:12px;font-weight:600;color:#7c6f94;margin-top:12px;position:relative;z-index:1}
        .sv1-gift-box.picked{pointer-events:none}
        .sv1-gift-box.picked.not-chosen{opacity:.3;transform:scale(.9);filter:grayscale(1)}
        .sv1-gift-box.shuffling{animation:sv1GBs .4s ease-in-out infinite alternate;pointer-events:none}
        @keyframes sv1GBs{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(-8px) rotate(3deg)}}
        .sv1-gift-box.shuffling.chosen{animation:sv1GBc .3s ease-in-out infinite alternate;border-color:rgba(124,58,237,.3);box-shadow:0 0 30px rgba(124,58,237,.1)}
        @keyframes sv1GBc{0%{transform:translateY(0) rotate(-2deg) scale(1.02)}100%{transform:translateY(-10px) rotate(2deg) scale(1.06)}}
        .sv1-gift-reveal{animation:sv1RI .6s cubic-bezier(.16,1,.3,1) both}
        @keyframes sv1RI{0%{opacity:0;transform:scale(.8) translateY(20px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        .sv1-gift-reveal-emoji{font-size:56px;margin-bottom:16px;animation:sv1RB .6s cubic-bezier(.34,1.56,.64,1) .2s both}
        @keyframes sv1RB{0%{transform:scale(0)}100%{transform:scale(1)}}
        .sv1-gift-reveal-title{font-family:'Inter Tight',sans-serif;font-size:28px;font-weight:800;margin:0 0 8px;letter-spacing:-.03em;background:linear-gradient(135deg,#c2855a,#d4a574 40%,#e8c9a0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sv1RI .5s ease-out .3s both}
        .sv1-gift-reveal-desc{font-family:'Inter Tight',sans-serif;font-size:15px;color:#7c6f94;margin:0 0 24px;animation:sv1RI .5s ease-out .4s both}
        .sv1-gift-code-wrap{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:24px;animation:sv1RI .5s ease-out .5s both}
        .sv1-gift-code{font-family:'Inter Tight',monospace;font-size:20px;font-weight:800;color:#1a1225;letter-spacing:.08em;padding:12px 24px;background:#f8f6fd;border:2px dashed rgba(124,58,237,.2);border-radius:10px}
        .sv1-gift-copy{font-family:'Inter Tight',sans-serif;font-size:13px;font-weight:600;color:#7c3aed;background:rgba(124,58,237,.06);border:1px solid rgba(124,58,237,.15);border-radius:8px;padding:12px 18px;cursor:pointer;transition:all .2s ease}
        .sv1-gift-copy:hover{background:rgba(124,58,237,.12);border-color:rgba(124,58,237,.3)}
        .sv1-gift-copy.copied{color:#16a34a;border-color:rgba(34,197,94,.2);background:rgba(34,197,94,.06)}
        .sv1-gift-redeem{font-family:'Inter Tight',sans-serif;font-size:13px;color:#a099b2;margin:0;line-height:1.5;animation:sv1RI .5s ease-out .6s both}
        .sv1-gift-confetti{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0}
        .sv1-gift-confetti span{position:absolute;border-radius:50%;top:50%;left:50%;animation:sv1CF 1.2s cubic-bezier(.25,.46,.45,.94) forwards}
        @keyframes sv1CF{0%{transform:translate(0,0) scale(0);opacity:1}100%{transform:translate(var(--x),var(--y)) scale(1);opacity:0}}
        @media(max-width:960px){.sv1{padding:80px 0}.sv1-inner{padding:0 24px}.sv1-header{flex-direction:column;align-items:flex-start}.sv1-grid{grid-template-columns:repeat(2,1fr)}.sv1-title{font-size:36px}.sv1-cta{grid-template-columns:1fr}.sv1-cta-badge{padding:24px}.sv1-cta-content{padding:24px}.sv1-cta-action{padding:24px}.sv1-cta-features{flex-wrap:wrap}}
        @media(max-width:600px){.sv1{padding:40px 0}.sv1-inner{padding:0 20px}.sv1-grid{grid-template-columns:1fr}.sv1-title{font-size:36px;font-weight:800}.sv1-card{height:280px}.sv1-card:hover{transform:none;box-shadow:none}.sv1-card:hover .sv1-card-img{transform:none;filter:saturate(1.1) contrast(1.05)}.sv1-card-desc{font-size:13.5px;min-height:auto}.sv1-card-title{font-size:16px}.sv1-cta-badge{text-align:left;padding:24px 24px 16px}.sv1-cta-badge-amount{font-size:48px}.sv1-cta-badge-label{font-size:12px}.sv1-cta-badge-sub{font-size:13px}.sv1-cta-content{text-align:left;padding:0 24px 24px}.sv1-cta-features{flex-direction:column;gap:8px;align-items:flex-start}.sv1-cta-action{align-items:stretch;padding:0 24px 24px}.sv1-cta-btn{justify-content:center}.sv1-cta-call{justify-content:center;font-size:15px}}
        @media(max-width:500px){.sv1-gift-boxes{flex-direction:column;align-items:center}.sv1-gift-box{width:100%;max-width:200px;height:120px}.sv1-gift-modal{padding:32px 24px}}
      `}} />
      
      <section className="sv1">
        <div className="sv1-inner">
          <div className="sv1-header">
            <div className="sv1-header-left">
              <h2 className="sv1-title">The <span className="sv1-title-gradient">Gold Standard</span> in<br />The Chimney Industry</h2>
            </div>
            <div className="sv1-header-right">
              <p className="sv1-subtitle">From routine inspections to complex repairs, we keep your chimney and fireplace safe, efficient, and beautiful.</p>
              <button type="button" className="sv1-header-cta" id="claimOfferBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Claim Offer
              </button>
            </div>
          </div>
      
          <div className="sv1-grid">
            <a href={`${city.name}`} className="sv1-card"><div className="sv1-card-img-wrap"><img className="sv1-card-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da86840f464e36c79b_chimney-inspection-roofline-flue-evaluation.webp" alt="Chimney Inspection" /></div><div className="sv1-card-body"><div className="sv1-card-header"><div className="sv1-card-icon"><lottie-player src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65eb8eee191ec1f829c9540e_wired-outline-408-worker-helmet.json" background="transparent" speed="1" style={{ width: '28px', height: '28px' }} loop={true} autoplay={true}></lottie-player></div><h3 className="sv1-card-title">Chimney Inspection</h3></div><p className="sv1-card-desc">We check that your chimney is safe, efficient, and up to code.</p><span className="sv1-card-link">Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div></a>
            <a href={`${city.name}`} className="sv1-card"><div className="sv1-card-img-wrap"><img className="sv1-card-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441dad118f5b09b76612a_chimney-sweep-roof-brush-flue-cleaning.webp" alt="Chimney Sweep" /></div><div className="sv1-card-body"><div className="sv1-card-header"><div className="sv1-card-icon"><lottie-player src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65ebaec474cbf919bba1e792_wired-outline-1706-duster.json" background="transparent" speed="1" style={{ width: '28px', height: '28px' }} loop={true} autoplay={true}></lottie-player></div><h3 className="sv1-card-title">Chimney Sweep</h3></div><p className="sv1-card-desc">We clean your chimney by removing soot and buildup safely.</p><span className="sv1-card-link">Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div></a>
            <a href={`${city.name}`} className="sv1-card"><div className="sv1-card-img-wrap"><img className="sv1-card-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da1f125b0cd8259ddc_chimney-repair-flashing-masonry-restoration.webp" alt="Chimney Repair" /></div><div className="sv1-card-body"><div className="sv1-card-header"><div className="sv1-card-icon"><lottie-player src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65ebaec471d4192c85d0a3cf_wired-outline-778-trowel.json" background="transparent" speed="1" style={{ width: '28px', height: '28px' }} loop={true} autoplay={true}></lottie-player></div><h3 className="sv1-card-title">Chimney Repair</h3></div><p className="sv1-card-desc">We bring your chimney back to strong, reliable condition.</p><span className="sv1-card-link">Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div></a>
            <a href={`${city.name}`} className="sv1-card"><div className="sv1-card-img-wrap"><img className="sv1-card-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/6944464c3d3dac45d014f642_chimney-cap-installation-metal-roof.webp" alt="Chimney Caps" /></div><div className="sv1-card-body"><div className="sv1-card-header"><div className="sv1-card-icon"><lottie-player src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65ebaec4b04cb84b443b64f8_wired-outline-1901-burning-fuel-flame.json" background="transparent" speed="1" style={{ width: '28px', height: '28px' }} loop={true} autoplay={true}></lottie-player></div><h3 className="sv1-card-title">Chimney Caps</h3></div><p className="sv1-card-desc">We protect your chimney from debris, animals, and moisture.</p><span className="sv1-card-link">Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div></a>
            <a href={`${city.name}`} className="sv1-card"><div className="sv1-card-img-wrap"><img className="sv1-card-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da89a8a6b303d8e2cd_fireplace-inspection-wood-stove-firebox-check.webp" alt="Fireplace Inspection" /></div><div className="sv1-card-body"><div className="sv1-card-header"><div className="sv1-card-icon"><lottie-player src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/65ebaec5e23bdf2327f06622_wired-outline-685-sailor-capitan.json" background="transparent" speed="1" style={{ width: '28px', height: '28px' }} loop={true} autoplay={true}></lottie-player></div><h3 className="sv1-card-title">Fireplace Inspection</h3></div><p className="sv1-card-desc">We check that your fireplace is functioning safely.</p><span className="sv1-card-link">Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div></a>
            <a href={`${city.name}`} className="sv1-card"><div className="sv1-card-img-wrap"><img className="sv1-card-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/69444843af33507eea1da352_fireplace-cleaning-hepa-vacuum-soot-removal.webp" alt="Fireplace Cleaning" /></div><div className="sv1-card-body"><div className="sv1-card-header"><div className="sv1-card-icon"><lottie-player src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/67b41ec030ee5e8f741e918f_wired-outline-1701-broom-hover-pinch.json" background="transparent" speed="1" style={{ width: '28px', height: '28px' }} loop={true} autoplay={true}></lottie-player></div><h3 className="sv1-card-title">Fireplace Cleaning</h3></div><p className="sv1-card-desc">We clean your fireplace by removing heavy build-up.</p><span className="sv1-card-link">Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div></a>
            <a href={`${city.name}`} className="sv1-card"><div className="sv1-card-img-wrap"><img className="sv1-card-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441daa14d749f6241b0a1_fireplace-repair-firebox-masonry-damage.webp" alt="Fireplace Repair" /></div><div className="sv1-card-body"><div className="sv1-card-header"><div className="sv1-card-icon"><lottie-player src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/66e9b2b2090ddb0d46c6965c_wired-outline-409-tool-hover-oscillate.json" background="transparent" speed="1" style={{ width: '28px', height: '28px' }} loop={true} autoplay={true}></lottie-player></div><h3 className="sv1-card-title">Fireplace Repair</h3></div><p className="sv1-card-desc">We fix cracks and damage so your fireplace works safely again.</p><span className="sv1-card-link">Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div></a>
            <a href={`${city.name}`} className="sv1-card"><div className="sv1-card-img-wrap"><img className="sv1-card-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da14746f8ed1a7a600_fireplace-maintenance-safe-home-use.webp" alt="Fireplace Maintenance" /></div><div className="sv1-card-body"><div className="sv1-card-header"><div className="sv1-card-icon"><lottie-player src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/66eb000f5bb8b022c6795063_plan.json" background="transparent" speed="1" style={{ width: '28px', height: '28px' }} loop={true} autoplay={true}></lottie-player></div><h3 className="sv1-card-title">Fireplace Maintenance</h3></div><p className="sv1-card-desc">Ongoing service that helps prevent costly repairs.</p><span className="sv1-card-link">Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div></a>
            <a href={`${city.name}`} className="sv1-card"><div className="sv1-card-img-wrap"><img className="sv1-card-img" src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da03f91ef31c0da8f9_gas-fireplace-repair-burner-flame-performance.webp" alt="Gas Fireplace Repair" /></div><div className="sv1-card-body"><div className="sv1-card-header"><div className="sv1-card-icon"><lottie-player src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/67b41f9229b6fc32d0988eaf_wired-outline-1649-gas-stove-hover-pinch.json" background="transparent" speed="1" style={{ width: '28px', height: '28px' }} loop={true} autoplay={true}></lottie-player></div><h3 className="sv1-card-title">Gas Fireplace Repair</h3></div><p className="sv1-card-desc">We diagnose and fix gas fireplace issues for safe, reliable heat.</p><span className="sv1-card-link">Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div></a>
          </div>
      
          {/* CTA BANNER */}
          <div className="sv1-cta">
            <div className="sv1-cta-badge">
              <span className="sv1-cta-badge-label">Only</span>
              <span className="sv1-cta-badge-amount">$69</span>
              <span className="sv1-cta-badge-sub">per inspection</span>
            </div>
            <div className="sv1-cta-content">
              <p className="sv1-cta-heading">Schedule your inspection today</p>
              <p className="sv1-cta-desc">Our certified technicians are available this week. Book now and get a full chimney or fireplace assessment.</p>
              <div className="sv1-cta-features">
                <span className="sv1-cta-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Same-week availability</span>
                <span className="sv1-cta-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Insured & Bonded</span>
                <span className="sv1-cta-feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Satisfaction guaranteed</span>
              </div>
            </div>
            <div className="sv1-cta-action">
              <button type="button" className="sv1-cta-btn" id="servicesCtaBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" /><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8" /></svg>
                Book Appointment
              </button>
              <a href={`tel:${city.phone}`} className="sv1-cta-call">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: '0' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>{`
                ${city.phone_text}
              `}</a>
            </div>
          </div>
        </div>
      </section>
      
      {/* GIFT MODAL */}
      <div className="sv1-gift-overlay" id="giftOverlay">
        <div className="sv1-gift-modal">
          <button className="sv1-gift-close" id="giftClose">&times;</button>
          <div id="giftPickState">
            <h3 className="sv1-gift-title" id="giftTitle">Pick Your Gift</h3>
            <p className="sv1-gift-subtitle" id="giftSubtitle">Choose one of three mystery gifts below. Each one contains an exclusive offer.</p>
            <div className="sv1-gift-boxes" id="giftBoxes">
              <div className="sv1-gift-box" data-index="0"><span className="sv1-gift-box-emoji">🎁</span><span className="sv1-gift-box-label">Gift 1</span></div>
              <div className="sv1-gift-box" data-index="1"><span className="sv1-gift-box-emoji">🎀</span><span className="sv1-gift-box-label">Gift 2</span></div>
              <div className="sv1-gift-box" data-index="2"><span className="sv1-gift-box-emoji">🎊</span><span className="sv1-gift-box-label">Gift 3</span></div>
            </div>
          </div>
          <div id="giftRevealState" className="sv1-gift-reveal" style={{ display: 'none' }}>
            <div className="sv1-gift-confetti" id="giftConfetti"></div>
            <div className="sv1-gift-reveal-emoji" id="revealEmoji"></div>
            <h3 className="sv1-gift-reveal-title" id="revealTitle"></h3>
            <p className="sv1-gift-reveal-desc" id="revealDesc"></p>
            <div className="sv1-gift-code-wrap">
              <span className="sv1-gift-code" id="revealCode"></span>
              <button className="sv1-gift-copy" id="copyCodeBtn">Copy Code</button>
            </div>
            <p className="sv1-gift-redeem">Mention this code when you call, or enter it in the form when booking.</p>
          </div>
        </div>
      </div>
    </>
  );
}
