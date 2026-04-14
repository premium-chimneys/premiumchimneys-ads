
'use client';
import { useEffect } from 'react';

export default function CaseStudies({ city }) {
  useEffect(() => {
    // ---- script block ----
    try {
      (function() {
        // ── Case studies data ──
        var cases = [
          { img: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/6934df6ddef10ac1dd1ba363_chimney-siding-replacement-before-after.webp', tag: 'Client Project', scope: 'Interior · Chimney Siding', title: 'Chimney Siding Rebuild', desc: 'We replaced severely weathered chimney siding, installed new trim, and added a custom metal chimney cap for better protection and airflow. The chimney is now structurally sound, watertight, and visually upgraded.', stat: 'Fully restored', duration: '3 days' },
          { img: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/6934df6d92d2220154bacb67_chimney-rebuild-before-after.webp', tag: 'Client Project', scope: 'Exterior · Full Rebuild', title: 'Chimney Stack Rebuild', desc: 'We reconstructed this chimney chase by removing deteriorated siding, installing new composite panels, and sealing all joints for weather protection. The rebuilt structure provides durability and proper ventilation.', stat: 'Full reconstruction', duration: '4 days' },
          { img: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/6934df6da6922490e814aad5_gas-fireplace-installation-modern.webp', tag: 'Client Project', scope: 'Interior · Fireplace', title: 'Gas Log Installation', desc: 'This fireplace was upgraded with a modern gas log set, a clean steel surround, and new stones for improved efficiency and appearance. The result is a reliable, clean-burning system with a sleek, contemporary finish.', stat: 'Modern upgrade', duration: '1 day' },
          { img: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/6934df6d874f8d0c8c7dfa96_gas-fireballs-installation.webp', tag: 'Client Project', scope: 'Interior · Fireplace', title: 'Gas Fireballs Installation', desc: 'This project features a vented fireball burner installation, offering a modern flame presentation and efficient heat output. The fireballs create a contemporary aesthetic while maintaining reliable and safe operation.', stat: 'Vented system', duration: '1 day' },
          { img: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/6934df6dddd218260125225d_firebox-repair-before-after.webp', tag: 'Client Project', scope: 'Interior · Firebox', title: 'Firebox Repair', desc: 'This project involved restoring a firebox with failing bricks and deteriorated mortar. We rebuilt the damaged sections using high-heat materials, corrected structural issues, and delivered a clean, safe, and fully functional firebox.', stat: 'Fully rebuilt', duration: '2 days' }
        ];
      
        // ── Build bento grid ──
        var grid = document.getElementById('csBentoGrid');
        var scopeIcon = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6-3.3 3.3-1.6-1.6a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.4l5.3-5.3 1.6 1.6a1 1 0 001.4 0l4-4 1.6 1.6a1 1 0 001.4-1.4l-4-4a1 1 0 00-1-0z"/></svg>';
        var arrowIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      
        cases.forEach(function(c, i) {
          var card = document.createElement('div');
          card.className = 'bento-card' + (i === 3 ? ' cs-bento-span2' : '');
          card.style.animation = 'caseReveal 0.6s cubic-bezier(0.16,1,0.3,1) ' + (0.15 + i * 0.08) + 's both';
          card.innerHTML = '<img src="' + c.img + '" alt="' + c.title + '">' +
            '<div class="bento-card-gradient"></div>' +
            '<div class="bento-tag">' + c.tag + '</div>' +
            '<div class="bento-bottom">' +
              '<div class="bento-scope">' + scopeIcon + ' ' + c.scope + '</div>' +
              '<div class="bento-title">' + c.title + '</div>' +
              '<div class="bento-arrow">Learn more ' + arrowIcon + '</div>' +
            '</div>';
          card.addEventListener('click', function() { openModal(c); });
          grid.appendChild(card);
        });
      
        // ── Modal ──
        var modal = document.getElementById('csModal');
        var closeBtn = document.getElementById('csModalClose');
      
        var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        var savedScrollY = 0;
      
        function openModal(c) {
          document.getElementById('csModalImg').src = c.img;
          document.getElementById('csModalImg').alt = c.title;
          document.getElementById('csModalTag').textContent = c.tag;
          document.getElementById('csModalScope').textContent = c.scope;
          document.getElementById('csModalDuration').textContent = c.duration;
          document.getElementById('csModalTitle').textContent = c.title;
          document.getElementById('csModalDesc').textContent = c.desc;
          document.getElementById('csModalStat').textContent = c.stat;
          modal.classList.add('active');
          savedScrollY = window.scrollY;
          document.body.classList.add('cs-modal-open');
          document.body.style.top = '-' + savedScrollY + 'px';
          document.body.style.paddingRight = scrollbarWidth + 'px';
        }
      
        function closeModal() {
          modal.classList.remove('active');
          document.body.classList.remove('cs-modal-open');
          document.body.style.top = '';
          document.body.style.paddingRight = '';
          window.scrollTo(0, savedScrollY);
        }
      
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
      
        // ── CTA Form submission (Web3Forms) ──
        var csUrlField = document.getElementById('csPageUrlField');
        if (csUrlField) csUrlField.value = window.location.href;
      
        var csForm = document.getElementById('csCtaForm');
        if (csForm) {
          csForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = document.getElementById('csCtaSubmitBtn');
            btn.disabled = true;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg> Sending to dispatch...';
      
            var data = {};
            var inputs = csForm.querySelectorAll('input, textarea');
            for (var i = 0; i < inputs.length; i++) {
              if (inputs[i].name) data[inputs[i].name] = inputs[i].value;
            }
      
            var formCard = document.getElementById('csCtaFormCard');
      
            fetch('https://api.web3forms.com/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            }).then(function(res) {
              if (res.ok) {
                formCard.classList.add('submitted');
              } else {
                btn.disabled = false;
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg> Submit Request';
              }
            }).catch(function() {
              btn.disabled = false;
              btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg> Submit Request';
            });
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
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
      
        .cs-wrap * { margin: 0; padding: 0; box-sizing: border-box; }
        .cs-wrap { font-family: 'DM Sans', sans-serif; background: #0a0a0a; }
      
        @keyframes caseReveal { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmerLine { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes shimmerText { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes formGlow { 0%, 100% { box-shadow: 0 0 40px rgba(124,58,237,0.08); } 50% { box-shadow: 0 0 60px rgba(124,58,237,0.15); } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(30px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes crownFloat { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
        @keyframes starTwinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes slideStatIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      
        /* Section */
        .cs-section { background: #0a0a0a; padding: 120px 48px 40px; position: relative; overflow: hidden; }
        .cs-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
      
        /* Heading */
        .cs-header { margin-bottom: 72px; text-align: center; }
        .cs-h2 { font-family: 'Inter Tight', sans-serif; font-size: 64px; font-weight: 900; color: #fff; letter-spacing: -0.05em; line-height: 1.05; }
        .cs-h2-accent { background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmerText 4s ease-in-out infinite; }
      
      
        /* Featured */
        .cs-featured { position: relative; border-radius: 20px; overflow: hidden; margin-bottom: 16px; border: 1px solid rgba(124,58,237,0.2); }
        .cs-featured-grid { display: grid; grid-template-columns: 1.1fr 1fr; min-height: 480px; }
        .cs-featured-img-wrap { position: relative; overflow: hidden; }
        .cs-featured-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .cs-featured-img-fade { position: absolute; inset: 0; background: linear-gradient(to right, transparent 60%, #0f0a18 100%); }
        .cs-featured-star { position: absolute; z-index: 3; opacity: 0.3; filter: drop-shadow(0 0 4px rgba(167,139,250,0.5)); }
        .cs-crown-wrap { position: absolute; top: 20px; left: 20px; z-index: 5; display: flex; align-items: center; gap: 8px; }
        .cs-crown { font-size: 28px; animation: crownFloat 3s ease-in-out infinite; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); }
        .cs-crown-badge { background: linear-gradient(135deg, rgba(124,58,237,0.9), rgba(167,139,250,0.9)); backdrop-filter: blur(12px); border-radius: 10px; padding: 7px 14px; font-size: 12px; font-weight: 700; color: #fff; font-family: 'Inter Tight', sans-serif; letter-spacing: 0.04em; text-transform: uppercase; box-shadow: 0 4px 16px rgba(124,58,237,0.4); }
      
        .cs-featured-content { background: linear-gradient(135deg, #0f0a18, #1a1025); padding: 48px 40px; display: flex; flex-direction: column; justify-content: center; }
        .cs-featured-meta { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 500; display: flex; align-items: center; gap: 5px; margin-bottom: 12px; font-family: 'Inter Tight', sans-serif; }
        .cs-featured-meta-sep { margin: 0 6px; color: rgba(255,255,255,0.15); }
        .cs-featured-title { font-family: 'Inter Tight', sans-serif; font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 16px; }
        .cs-featured-desc { font-size: 15px; color: rgba(255,255,255,0.5); line-height: 1.75; font-weight: 300; margin-bottom: 28px; }
        .cs-featured-stats { display: flex; gap: 24px; margin-bottom: 28px; }
        .cs-stat-val { font-family: 'Inter Tight', sans-serif; font-size: 24px; font-weight: 800; color: #a78bfa; letter-spacing: -0.03em; line-height: 1; }
        .cs-stat-label { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 4px; font-family: 'Inter Tight', sans-serif; font-weight: 500; }
        .cs-testimonial { background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.15); border-radius: 14px; padding: 20px; }
        .cs-testimonial-stars { display: flex; gap: 3px; margin-bottom: 10px; }
        .cs-testimonial-text { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.6; font-style: italic; font-weight: 300; margin-bottom: 10px; }
        .cs-testimonial-author { font-size: 12px; font-weight: 600; color: #a78bfa; font-family: 'Inter Tight', sans-serif; }
      
        /* Bento grid */
        .cs-bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 260px; gap: 16px; }
        .bento-card { position: relative; border-radius: 16px; overflow: hidden; cursor: pointer; background: #111; border: 1px solid rgba(255,255,255,0.06); transition: border-color 0.3s ease; }
        .bento-card:hover { border-color: rgba(124,58,237,0.3); }
        .bento-card:hover img { transform: scale(1.06); }
        .bento-card:hover .bento-arrow { background: #7c3aed; color: #fff; border-color: #7c3aed; }
        .bento-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; will-change: transform; position: absolute; inset: 0; }
        .bento-card-gradient { position: absolute; inset: 0; z-index: 1; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%); }
        .bento-tag { position: absolute; top: 14px; left: 14px; z-index: 3; background: rgba(124,58,237,0.85); backdrop-filter: blur(8px); border-radius: 6px; padding: 4px 10px; font-size: 10px; font-weight: 600; color: #fff; font-family: 'Inter Tight', sans-serif; letter-spacing: 0.04em; text-transform: uppercase; }
        .bento-bottom { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; padding: 20px; }
        .bento-scope { font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 500; margin-bottom: 5px; display: flex; align-items: center; gap: 4px; font-family: 'Inter Tight', sans-serif; }
        .bento-title { font-size: 16px; font-weight: 700; color: #fff; font-family: 'Inter Tight', sans-serif; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 12px; }
        .bento-arrow { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #a78bfa; font-family: 'Inter Tight', sans-serif; padding: 6px 14px; border-radius: 100px; border: 1px solid rgba(167,139,250,0.25); background: rgba(124,58,237,0.1); transition: all 0.3s ease; }
        .cs-bento-span2 { grid-column: span 2; }
      
        /* Modal */
        .cs-modal-overlay { display: none; position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); align-items: center; justify-content: center; animation: overlayIn 0.3s ease both; }
        .cs-modal-overlay.active { display: flex; }
        body.cs-modal-open { overflow: hidden !important; position: fixed !important; width: 100% !important; touch-action: none; }
        .cs-modal-inner { background: #111; border-radius: 20px; overflow: hidden; max-width: 720px; width: 100%; position: relative; border: 1px solid rgba(124,58,237,0.2); animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; max-height: 90vh; overflow-y: auto; margin: 40px; }
        .cs-modal-close { position: absolute; top: 16px; right: 16px; z-index: 5; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; transition: background 0.2s; }
        .cs-modal-close:hover { background: rgba(124,58,237,0.6); }
        .cs-modal-img { position: relative; height: 300px; }
        .cs-modal-img img { width: 100%; height: 100%; object-fit: cover; }
        .cs-modal-img-fade { position: absolute; inset: 0; background: linear-gradient(to top, #111 0%, transparent 60%); }
        .cs-modal-tag { position: absolute; top: 16px; left: 16px; background: rgba(124,58,237,0.85); backdrop-filter: blur(8px); border-radius: 8px; padding: 5px 12px; font-size: 11px; font-weight: 600; color: #fff; font-family: 'Inter Tight', sans-serif; letter-spacing: 0.04em; text-transform: uppercase; }
        .cs-modal-body { padding: 0 32px 32px; margin-top: -40px; position: relative; z-index: 2; }
        .cs-modal-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .cs-modal-meta-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 500; font-family: 'Inter Tight', sans-serif; }
        .cs-modal-title { font-family: 'Inter Tight', sans-serif; font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.03em; line-height: 1.2; margin-bottom: 16px; }
        .cs-modal-desc { font-size: 15px; color: rgba(255,255,255,0.55); line-height: 1.8; font-weight: 300; margin-bottom: 24px; }
        .cs-modal-stat { display: inline-flex; align-items: center; gap: 8px; background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2); border-radius: 100px; padding: 8px 16px; margin-bottom: 24px; }
        .cs-modal-stat span { font-size: 13px; font-weight: 600; color: #a78bfa; font-family: 'Inter Tight', sans-serif; }
        .cs-modal-footer { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px; display: flex; align-items: center; justify-content: space-between; }
        .cs-modal-footer-text { font-size: 14px; color: rgba(255,255,255,0.4); font-weight: 300; font-family: 'Inter Tight', sans-serif; }
        .cs-modal-cta { display: inline-flex; align-items: center; gap: 8px; font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 600; color: #f0e0fd; padding: 10px 20px; border: 1px solid #7c3aed; border-radius: 10px; background: linear-gradient(160deg, #9b5de5 0%, #7c3aed 25%, #5b21b6 50%, #6d28d9 72%, #8b5cf6 100%); box-shadow: inset 0 1px 0 rgba(196,155,240,0.55), 0 4px 12px rgba(91,33,182,0.4); text-decoration: none; transition: all 0.2s; text-shadow: 0 1px 2px rgba(45,15,80,0.35); }
        .cs-modal-cta:hover { transform: translateY(-1px); }
      
        /* CTA Banner */
        .cs-cta-section { background: #0a0a0a; padding: 40px 48px 120px; }
        .cs-cta-card { max-width: 1200px; margin: 0 auto; background: linear-gradient(135deg, #1a1025 0%, #130d1e 50%, #1a1025 100%); border-radius: 24px; overflow: hidden; position: relative; border: 1px solid rgba(124,58,237,0.15); }
        .cs-cta-aurora { height: 2px; width: 100%; background: linear-gradient(90deg, transparent, #7c3aed, #a78bfa, #c084fc, #a78bfa, #7c3aed, transparent); background-size: 300% 100%; animation: shimmerLine 4s ease-in-out infinite; }
        .cs-cta-grid { display: grid; grid-template-columns: 1fr 420px; gap: 60px; padding: 64px; position: relative; z-index: 1; align-items: center; }
        .cs-cta-price { font-family: 'Inter Tight', sans-serif; font-size: 52px; font-weight: 900; color: #fff; letter-spacing: -0.04em; line-height: 1; }
        .cs-cta-only { font-size: 11px; font-weight: 600; color: #a78bfa; letter-spacing: 0.06em; text-transform: uppercase; font-family: 'Inter Tight', sans-serif; }
        .cs-cta-per { font-size: 12px; color: rgba(255,255,255,0.35); font-family: 'Inter Tight', sans-serif; }
        .cs-cta-heading { font-family: 'Inter Tight', sans-serif; font-size: 36px; font-weight: 800; color: #fff; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 16px; }
        .cs-cta-heading-accent { color: #a78bfa; }
        .cs-cta-desc { font-size: 15px; color: rgba(255,255,255,0.4); line-height: 1.7; font-weight: 300; max-width: 420px; margin-bottom: 32px; }
        .cs-cta-trust { display: flex; align-items: center; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.55); font-weight: 400; font-family: 'Inter Tight', sans-serif; margin-bottom: 14px; }
      
        /* CTA Form */
        .cs-cta-form-card { background: rgba(255,255,255,0.04); border-radius: 20px; border: 1px solid rgba(124,58,237,0.2); padding: 28px; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .cs-cta-form-title { font-family: 'Inter Tight', sans-serif; font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.02em; margin-bottom: 4px; }
        .cs-cta-form-sub { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.5; }
        .cs-cta-dispatch { display: flex; align-items: center; gap: 10px; padding: 10px 14px; margin: 16px 0; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); border-radius: 10px; }
        .cs-cta-dispatch-dot { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; flex-shrink: 0; box-shadow: 0 0 8px rgba(22,163,74,0.6); }
        .cs-cta-dispatch-text { font-size: 12px; font-weight: 500; color: #16a34a; font-family: 'Inter Tight', sans-serif; }
        .cs-cta-form { display: flex; flex-direction: column; gap: 10px; }
        .cs-cta-input { width: 100%; font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 400; padding: 12px 16px; border: 1.5px solid rgba(124,58,237,0.15); border-radius: 12px; background: rgba(255,255,255,0.06); color: #fff; outline: none; transition: all 0.25s ease; box-sizing: border-box; }
        .cs-cta-input::placeholder { color: rgba(255,255,255,0.3); }
        .cs-cta-input:focus { border-color: #7c3aed; background: rgba(255,255,255,0.08); box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
        .cs-cta-textarea { resize: none; min-height: 80px; }
        .cs-cta-submit { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 600; color: #f0e0fd; padding: 14px 24px; border: 1px solid #7c3aed; border-radius: 12px; background: linear-gradient(160deg, #9b5de5 0%, #7c3aed 25%, #5b21b6 50%, #6d28d9 72%, #8b5cf6 100%); box-shadow: inset 0 1px 0 rgba(196,155,240,0.55), inset 0 -1px 0 rgba(0,0,0,0.22), 0 4px 16px rgba(91,33,182,0.45); cursor: pointer; transition: all 0.22s ease; position: relative; overflow: hidden; text-shadow: 0 1px 2px rgba(45,15,80,0.35); margin-top: 4px; }
        .cs-cta-submit:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(196,155,240,0.55), inset 0 -1px 0 rgba(0,0,0,0.22), 0 8px 24px rgba(91,33,182,0.5); }
        .cs-cta-disclaimer { font-size: 11px; color: rgba(255,255,255,0.25); line-height: 1.5; text-align: center; margin-top: 8px; }
        .cs-cta-trust-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 4px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
        .cs-cta-trust-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 500; font-family: 'Inter Tight', sans-serif; }
      
        /* Form success state */
        @keyframes successFadeIn { 0% { opacity: 0; transform: scale(0.92) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes successCheckPop { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.15); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes successTextUp { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
      
        .cs-cta-success { display: none; text-align: center; padding: 48px 20px; }
        .cs-cta-form-card.submitted .cs-cta-success { display: block; animation: successFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .cs-cta-form-card.submitted .cs-cta-form-title,
        .cs-cta-form-card.submitted .cs-cta-form-sub,
        .cs-cta-form-card.submitted .cs-cta-dispatch,
        .cs-cta-form-card.submitted .cs-cta-form { display: none; }
        .cs-success-ring { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 20px; position: relative; display: flex; align-items: center; justify-content: center; animation: successCheckPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both; }
        .cs-success-ring::before { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 1.5px solid rgba(34,197,94,0.25); }
        .cs-success-circle { width: 64px; height: 64px; border-radius: 50%; background: rgba(34,197,94,0.08); border: 1.5px solid rgba(34,197,94,0.2); display: flex; align-items: center; justify-content: center; }
        .cs-success-h3 { font-family: 'Inter Tight', sans-serif; font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 8px; letter-spacing: -0.02em; animation: successTextUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
        .cs-success-p { font-family: 'Inter Tight', sans-serif; font-size: 14px; color: rgba(255,255,255,0.4); margin: 0; line-height: 1.5; animation: successTextUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
      
        /* Responsive */
        @media (max-width: 960px) {
          .cs-featured-grid { grid-template-columns: 1fr !important; }
          .cs-featured-img-wrap { min-height: 280px !important; }
          .cs-bento-grid { grid-template-columns: 1fr 1fr !important; }
          .cs-bento-span2 { grid-column: span 1 !important; }
          .cs-cta-grid { grid-template-columns: 1fr !important; }
          .cs-section { padding: 80px 24px 60px !important; }
          .cs-cta-section { padding: 0 24px 80px !important; }
          .cs-cta-grid { padding: 40px 24px !important; }
          .cs-h2 { font-size: 42px !important; }
        }
      
        @media (max-width: 600px) {
          .cs-bento-grid { grid-template-columns: 1fr !important; }
          .cs-featured-content { padding: 32px 24px !important; }
          .cs-featured-stats { flex-direction: column; gap: 16px !important; }
          .cs-h2 { font-size: 32px !important; }
          .cs-cta-section { padding: 40px 0 0 !important; }
          .cs-cta-card { border-radius: 0 !important; border-left: none !important; border-right: none !important; }
          .cs-cta-grid { padding: 32px 20px !important; gap: 32px !important; }
          .cs-cta-price { font-size: 40px !important; }
          .cs-cta-heading { font-size: 28px !important; }
          .cs-cta-form-card { padding: 20px !important; border-radius: 16px !important; }
          .cs-modal-inner { margin: 16px !important; max-height: calc(100vh - 32px) !important; }
          .cs-modal-img { height: 220px !important; }
          .cs-cta-trust-row { flex-wrap: wrap; gap: 8px !important; }
        }
      `}} />
      
      <div className="cs-wrap">
      
        {/* ═══════════ CASE STUDIES ═══════════ */}
        <section className="cs-section" id="csSection">
      
      
          <div className="cs-inner">
      
            {/* Header */}
            <div className="cs-header">
              <h2 className="cs-h2">See what's possible<br />for <span className="cs-h2-accent">your home.</span></h2>
            </div>
      
            {/* Featured Project */}
            <div className="cs-featured">
              <div className="cs-crown-wrap">
                <div className="cs-crown">👑</div>
                <div className="cs-crown-badge">Featured Project</div>
              </div>
              <div className="cs-featured-grid">
                <div className="cs-featured-img-wrap">
                  <img src="https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/6934df6d29b38daba642986c_custom-chimney-cap-installation.webp" alt="Custom Chimney Cap" />
                  <div className="cs-featured-img-fade"></div>
                  <svg className="cs-featured-star" width="14" height="14" viewBox="0 0 24 24" fill="#a78bfa" style={{ top: '15%', left: '8%', animation: 'starTwinkle 2.5s ease-in-out infinite' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <svg className="cs-featured-star" width="10" height="10" viewBox="0 0 24 24" fill="#a78bfa" style={{ top: '25%', left: '20%', animation: 'starTwinkle 2.5s ease-in-out 0.8s infinite' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <svg className="cs-featured-star" width="12" height="12" viewBox="0 0 24 24" fill="#a78bfa" style={{ top: '10%', left: '35%', animation: 'starTwinkle 2.5s ease-in-out 1.6s infinite' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <svg className="cs-featured-star" width="8" height="8" viewBox="0 0 24 24" fill="#a78bfa" style={{ top: '30%', left: '12%', animation: 'starTwinkle 2.5s ease-in-out 2.2s infinite' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <svg className="cs-featured-star" width="11" height="11" viewBox="0 0 24 24" fill="#a78bfa" style={{ top: '20%', left: '42%', animation: 'starTwinkle 2.5s ease-in-out 0.4s infinite' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </div>
                <div className="cs-featured-content">
                  <div className="cs-featured-meta">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6-3.3 3.3-1.6-1.6a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.4l5.3-5.3 1.6 1.6a1 1 0 001.4 0l4-4 1.6 1.6a1 1 0 001.4-1.4l-4-4a1 1 0 00-1-0z" /></svg>
                    Exterior · Chimney Cap
                    <span className="cs-featured-meta-sep">·</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                    1 day
                  </div>
                  <h3 className="cs-featured-title">Custom Chimney Cap</h3>
                  <p className="cs-featured-desc">We designed and installed a custom-fabricated chimney cap to protect the structure from rain, debris, and animals. The new cap improves draft performance while enhancing the look of the stucco chimney. Built to last with heavy-gauge stainless steel and a lifetime warranty.</p>
                  <div className="cs-featured-stats">
                    <div style={{ animation: 'slideStatIn 0.5s ease 0.3s both' }}><div className="cs-stat-val">100%</div><div className="cs-stat-label">Custom fabricated</div></div>
                    <div style={{ animation: 'slideStatIn 0.5s ease 0.45s both' }}><div className="cs-stat-val">0</div><div className="cs-stat-label">Leaks since install</div></div>
                    <div style={{ animation: 'slideStatIn 0.5s ease 0.6s both' }}><div className="cs-stat-val">Lifetime</div><div className="cs-stat-label">Warranty included</div></div>
                  </div>
                  <div className="cs-testimonial">
                    <div className="cs-testimonial-stars">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#a78bfa"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#a78bfa"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#a78bfa"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#a78bfa"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#a78bfa"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    </div>
                    <p className="cs-testimonial-text">"The cap looks incredible and fits perfectly. No more water issues, no more animals. Should have done this years ago."</p>
                    <div className="cs-testimonial-author">— Michael T.</div>
                  </div>
                </div>
              </div>
            </div>
      
            {/* Bento Grid */}
            <div className="cs-bento-grid" id="csBentoGrid"></div>
          </div>
        </section>
      
        {/* Modal */}
        <div className="cs-modal-overlay" id="csModal">
          <div className="cs-modal-inner">
            <button className="cs-modal-close" id="csModalClose">&times;</button>
            <div className="cs-modal-img" id="csModalImgWrap">
              <img id="csModalImg" src="" alt="" />
              <div className="cs-modal-img-fade"></div>
              <div className="cs-modal-tag" id="csModalTag"></div>
            </div>
            <div className="cs-modal-body">
              <div className="cs-modal-meta">
                <div className="cs-modal-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6-3.3 3.3-1.6-1.6a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.4l5.3-5.3 1.6 1.6a1 1 0 001.4 0l4-4 1.6 1.6a1 1 0 001.4-1.4l-4-4a1 1 0 00-1-0z" /></svg>
                  <span id="csModalScope"></span>
                </div>
                <div className="cs-modal-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                  <span id="csModalDuration"></span>
                </div>
              </div>
              <h3 className="cs-modal-title" id="csModalTitle"></h3>
              <p className="cs-modal-desc" id="csModalDesc"></p>
              <div className="cs-modal-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span id="csModalStat"></span>
              </div>
              <div className="cs-modal-footer">
                <p className="cs-modal-footer-text">Need similar work done?</p>
                <a href={`tel:${city.phone}`} className="cs-modal-cta">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      
        {/* ═══════════ CTA BANNER ═══════════ */}
        <section className="cs-cta-section">
          <div className="cs-cta-card">
            <div className="cs-cta-aurora"></div>
            <div className="cs-cta-grid">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <span className="cs-cta-price">$69</span>
                  <div><div className="cs-cta-only">Only</div><div className="cs-cta-per">per inspection</div></div>
                </div>
                <h2 className="cs-cta-heading">Don't wait for the<br /><span className="cs-cta-heading-accent">damage to find you.</span></h2>
                <p className="cs-cta-desc">Every project in our case studies started the same way, a homeowner who finally picked up the phone. Book your inspection today and know exactly where your chimney stands.</p>
                <div className="cs-cta-trust"><span>📅</span> Same-week availability</div>
                <div className="cs-cta-trust"><span>🛡️</span> Insured & bonded</div>
                <div className="cs-cta-trust"><span>✅</span> 100% satisfaction guaranteed</div>
              </div>
              <div className="cs-cta-form-card" id="csCtaFormCard">
                <div className="cs-cta-success">
                  <div className="cs-success-ring"><div className="cs-success-circle"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div></div>
                  <h3 className="cs-success-h3">Submission Received</h3>
                  <p className="cs-success-p">Our dispatch team will reach out shortly.</p>
                </div>
                <h3 className="cs-cta-form-title">Request Service</h3>
                <p className="cs-cta-form-sub">Fill out our quick form to schedule a service call with our team today!</p>
                <div className="cs-cta-dispatch"><div className="cs-cta-dispatch-dot"></div><span className="cs-cta-dispatch-text">Goes straight to our dispatch team</span></div>
                <form className="wrapper-form-banner cs-cta-form" id="csCtaForm">
                  <input type="hidden" name="access_key" value="dd8ad38f-712e-4d31-8426-2579600f0df0" />
                  <input type="hidden" name="page_url" id="csPageUrlField" value="" />
                  <input className="cs-cta-input" type="text" name="name" placeholder="Full Name" required={true} />
                  <input className="cs-cta-input" type="tel" name="phone" placeholder="Phone Number" required={true} />
                  <input className="cs-cta-input" type="email" name="email" placeholder="Email Address" required={true} />
                  <textarea className="cs-cta-input cs-cta-textarea" name="message" placeholder="How can we help?" rows="3"></textarea>
                  <button type="submit" className="cs-cta-submit" id="csCtaSubmitBtn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
                    Submit Request
                  </button>
                  <p className="cs-cta-disclaimer">By submitting, you agree to be contacted by one of our agents. Your information is confidential and won't be shared or sold.</p>
                  <div className="cs-cta-trust-row">
                    <span className="cs-cta-trust-item"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg> No spam</span>
                    <span className="cs-cta-trust-item"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg> No obligation</span>
                    <span className="cs-cta-trust-item"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg> Call back in 1 hr</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      
      </div>
    </>
  );
}
