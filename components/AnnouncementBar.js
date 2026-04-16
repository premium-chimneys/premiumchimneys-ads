'use client';
import { useEffect } from 'react';

function AnnouncementBarMembership({ city }) {
  useEffect(() => {
    // ---- script block ----
    try {
      (function() {
        var canvas = document.querySelector('.announcement-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
      
        function resize() {
          canvas.width = canvas.parentElement.offsetWidth;
          canvas.height = canvas.parentElement.offsetHeight || 44;
        }
        resize();
        window.addEventListener('resize', resize);
      
        var stars = [];
        var MAX_STARS = 14;
      
        function createStar() {
          return {
            x: Math.random() < 0.5
              ? Math.max(12, Math.random() * canvas.width * 0.35)
              : canvas.width * 0.65 + Math.random() * canvas.width * 0.35,
            y: Math.random() * canvas.height,
            length: 50 + Math.random() * 90,
            speed: 0.5 + Math.random() * 0.75,
            angle: Math.PI / 10 + (Math.random() - 0.5) * 0.22,
            opacity: 0,
            phase: 'in',
            trail: 0,
            width: 0.6 + Math.random() * 0.8
          };
        }
      
        var spawnInterval = setInterval(function() {
          if (stars.length < MAX_STARS) stars.push(createStar());
        }, 380);
        for (var i = 0; i < 4; i++) stars.push(createStar());
      
        var NUM_STATIC = 7;
        var glintStars = [];
        for (var j = 0; j < NUM_STATIC; j++) {
          glintStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 0.5 + Math.random() * 0.7,
            opacity: 0,
            phase: 'idle',
            nextGlint: Date.now() + Math.random() * 3000
          });
        }
      
        function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      
          for (var i = stars.length - 1; i >= 0; i--) {
            var s = stars[i];
      
            if (s.phase === 'in') {
              s.opacity = Math.min(1, s.opacity + 0.06);
              s.trail = Math.min(s.length, s.trail + s.speed * 4);
              if (s.opacity >= 1) s.phase = 'travel';
            } else if (s.phase === 'travel') {
              s.x += Math.cos(s.angle) * s.speed;
              s.y += Math.sin(s.angle) * s.speed * 0.4;
              s.trail = Math.min(s.length, s.trail + s.speed);
              if (s.x > canvas.width * 0.85 || s.x < canvas.width * 0.15) s.phase = 'out';
            } else {
              s.opacity = Math.max(0, s.opacity - 0.04);
              if (s.opacity <= 0) { stars.splice(i, 1); continue; }
            }
      
            var tailX = s.x - Math.cos(s.angle) * s.trail;
            var tailY = s.y - Math.sin(s.angle) * s.trail * 0.4;
      
            var grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0, 'rgba(139, 92, 246, 0)');
            grad.addColorStop(0.6, 'rgba(139, 92, 246, ' + (s.opacity * 0.25) + ')');
            grad.addColorStop(1, 'rgba(196, 181, 253, ' + (s.opacity * 0.9) + ')');
      
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.width;
            ctx.lineCap = 'round';
            ctx.stroke();
      
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.width * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232, 220, 255, ' + (s.opacity * 0.95) + ')';
            ctx.fill();
          }
      
          var now = Date.now();
          for (var k = 0; k < glintStars.length; k++) {
            var g = glintStars[k];
            if (g.phase === 'idle' && now >= g.nextGlint) {
              g.phase = 'in';
              g.opacity = 0;
            }
            if (g.phase === 'in') {
              g.opacity = Math.min(1, g.opacity + 0.04);
              if (g.opacity >= 1) g.phase = 'out';
            } else if (g.phase === 'out') {
              g.opacity = Math.max(0, g.opacity - 0.02);
              if (g.opacity <= 0) {
                g.phase = 'idle';
                g.nextGlint = now + 1500 + Math.random() * 4000;
              }
            }
      
            if (g.opacity > 0) {
              var glow = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.size * 4);
              glow.addColorStop(0, 'rgba(232, 220, 255, ' + (g.opacity * 0.95) + ')');
              glow.addColorStop(1, 'rgba(196, 181, 253, 0)');
              ctx.beginPath();
              ctx.arc(g.x, g.y, g.size * 4, 0, Math.PI * 2);
              ctx.fillStyle = glow;
              ctx.fill();
            }
          }
      
          requestAnimationFrame(draw);
        }
        draw();
      })();
    } catch (e) { console.error('[component script]', e); }
  }, []);
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .announcement-bar {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 10;
          width: 100%;
          height: 44px;
          background: #0e0b14;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: pointer;
        }
      
        .announcement-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      
        .announcement-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 14px;
        }
      
        .announcement-quarter {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #6b5c8a;
        }
      
        .announcement-divider {
          width: 1px;
          height: 14px;
          background: #2a1e42;
          flex-shrink: 0;
        }
      
        .announcement-avatars {
          display: flex;
          align-items: center;
        }
      
        .announcement-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1.5px solid #0e0b14;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -6px;
          flex-shrink: 0;
        }
      
        .announcement-avatar:first-child {
          margin-left: 0;
        }
      
        .announcement-avatar.claimed {
          background: #7c3aed;
        }
      
        .announcement-avatar.open {
          background: #15101e;
          border-color: #3a2a58;
        }
      
        .announcement-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #a8a0c4;
          letter-spacing: 0.01em;
        }
      
        .announcement-text strong {
          color: #ddd0f0;
          font-weight: 600;
        }
      
        .announcement-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(124, 58, 237, 0.15);
          border: 1px solid rgba(124, 58, 237, 0.32);
          border-radius: 20px;
          padding: 3px 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          color: #a78bfa;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
      
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          animation: barPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
      
        @keyframes barPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(0.65); }
        }
      
        @media (max-width: 760px) {
          .announcement-avatars { display: none; }
          .announcement-text { font-size: 12px; }
        }
      
        @media (max-width: 480px) {
          .announcement-quarter { display: none; }
          .announcement-divider { display: none; }
          .announcement-content { gap: 10px; }
        }
      `}} />
      <a href={`/membership/${city?.slug ?? ''}`} className="announcement-bar" style={{ textDecoration: 'none', color: 'inherit' }}>
        <canvas className="announcement-canvas"></canvas>
      
        <div className="announcement-content">
          <span className="announcement-quarter">Announcement</span>
          <div className="announcement-divider"></div>
      
          <div className="announcement-avatars">
            <div className="announcement-avatar claimed">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.5" fill="rgba(255,255,255,0.85)"></circle>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"></path>
              </svg>
            </div>
            <div className="announcement-avatar open">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.5" stroke="#3d2858" strokeWidth="1.5" strokeDasharray="2 2"></circle>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#3d2858" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"></path>
              </svg>
            </div>
            <div className="announcement-avatar open">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.5" stroke="#3d2858" strokeWidth="1.5" strokeDasharray="2 2"></circle>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#3d2858" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"></path>
              </svg>
            </div>
          </div>
      
          <span className="announcement-text">
            <strong>Yearly Club Membership</strong> — spots are filling fast.
          </span>
      
          <div className="announcement-pill">
            <span className="pulse-dot"></span>
            Claim Spot
          </div>
        </div>
      </a>
    </>
  );
}

function AnnouncementBarStandard({ city }) {
  useEffect(() => {
    // ---- script block ----
    try {
      (function() {
        var canvas = document.querySelector('.announcement-canvas-2');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
      
        function resize() {
          canvas.width = canvas.parentElement.offsetWidth;
          canvas.height = canvas.parentElement.offsetHeight || 44;
        }
        resize();
        window.addEventListener('resize', resize);
      
        var stars = [];
        var MAX_STARS = 14;
      
        function createStar() {
          return {
            x: Math.random() < 0.5
              ? Math.max(12, Math.random() * canvas.width * 0.35)
              : canvas.width * 0.65 + Math.random() * canvas.width * 0.35,
            y: Math.random() * canvas.height,
            length: 50 + Math.random() * 90,
            speed: 0.5 + Math.random() * 0.75,
            angle: Math.PI / 10 + (Math.random() - 0.5) * 0.22,
            opacity: 0,
            phase: 'in',
            trail: 0,
            width: 0.6 + Math.random() * 0.8
          };
        }
      
        var spawnInterval = setInterval(function() {
          if (stars.length < MAX_STARS) stars.push(createStar());
        }, 380);
        for (var i = 0; i < 4; i++) stars.push(createStar());
      
        var NUM_STATIC = 7;
        var glintStars = [];
        for (var j = 0; j < NUM_STATIC; j++) {
          glintStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 0.5 + Math.random() * 0.7,
            opacity: 0,
            phase: 'idle',
            nextGlint: Date.now() + Math.random() * 3000
          });
        }
      
        function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      
          for (var i = stars.length - 1; i >= 0; i--) {
            var s = stars[i];
      
            if (s.phase === 'in') {
              s.opacity = Math.min(1, s.opacity + 0.06);
              s.trail = Math.min(s.length, s.trail + s.speed * 4);
              if (s.opacity >= 1) s.phase = 'travel';
            } else if (s.phase === 'travel') {
              s.x += Math.cos(s.angle) * s.speed;
              s.y += Math.sin(s.angle) * s.speed * 0.4;
              s.trail = Math.min(s.length, s.trail + s.speed);
              if (s.x > canvas.width * 0.85 || s.x < canvas.width * 0.15) s.phase = 'out';
            } else {
              s.opacity = Math.max(0, s.opacity - 0.04);
              if (s.opacity <= 0) { stars.splice(i, 1); continue; }
            }
      
            var tailX = s.x - Math.cos(s.angle) * s.trail;
            var tailY = s.y - Math.sin(s.angle) * s.trail * 0.4;
      
            var grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0, 'rgba(139, 92, 246, 0)');
            grad.addColorStop(0.6, 'rgba(139, 92, 246, ' + (s.opacity * 0.25) + ')');
            grad.addColorStop(1, 'rgba(196, 181, 253, ' + (s.opacity * 0.9) + ')');
      
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.width;
            ctx.lineCap = 'round';
            ctx.stroke();
      
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.width * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232, 220, 255, ' + (s.opacity * 0.95) + ')';
            ctx.fill();
          }
      
          var now = Date.now();
          for (var k = 0; k < glintStars.length; k++) {
            var g = glintStars[k];
            if (g.phase === 'idle' && now >= g.nextGlint) {
              g.phase = 'in';
              g.opacity = 0;
            }
            if (g.phase === 'in') {
              g.opacity = Math.min(1, g.opacity + 0.04);
              if (g.opacity >= 1) g.phase = 'out';
            } else if (g.phase === 'out') {
              g.opacity = Math.max(0, g.opacity - 0.02);
              if (g.opacity <= 0) {
                g.phase = 'idle';
                g.nextGlint = now + 1500 + Math.random() * 4000;
              }
            }
      
            if (g.opacity > 0) {
              var glow = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.size * 4);
              glow.addColorStop(0, 'rgba(232, 220, 255, ' + (g.opacity * 0.95) + ')');
              glow.addColorStop(1, 'rgba(196, 181, 253, 0)');
              ctx.beginPath();
              ctx.arc(g.x, g.y, g.size * 4, 0, Math.PI * 2);
              ctx.fillStyle = glow;
              ctx.fill();
            }
          }
      
          requestAnimationFrame(draw);
        }
        draw();
      })();
    } catch (e) { console.error('[component script]', e); }
  }, []);
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .announcement-bar-2 {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 10;
          width: 100%;
          height: 44px;
          background: #0e0b14;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: pointer;
        }
      
        .announcement-canvas-2 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      
        .announcement-content-2 {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 14px;
        }
      
        .announcement-quarter-2 {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #6b5c8a;
        }
      
        .announcement-divider-2 {
          width: 1px;
          height: 14px;
          background: #2a1e42;
          flex-shrink: 0;
        }
      
        .announcement-text-2 {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #a8a0c4;
          letter-spacing: 0.01em;
        }
      
        .announcement-text-2 strong {
          color: #ddd0f0;
          font-weight: 600;
        }
      
        .announcement-pill-2 {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(124, 58, 237, 0.15);
          border: 1px solid rgba(124, 58, 237, 0.32);
          border-radius: 20px;
          padding: 3px 10px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          color: #a78bfa;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
      
        .pulse-dot-2 {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          animation: barPulse2 2s ease-in-out infinite;
          flex-shrink: 0;
        }
      
        @keyframes barPulse2 {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(0.65); }
        }
      
        @media (max-width: 480px) {
          .announcement-quarter-2 { display: none; }
          .announcement-divider-2 { display: none; }
          .announcement-content-2 { gap: 10px; }
          .announcement-text-2 { font-size: 12px; }
        }
      `}} />
      <a href={`tel:${city.phone}`} className="announcement-bar-2" style={{ textDecoration: 'none', color: 'inherit' }}>
        <canvas className="announcement-canvas-2"></canvas>
      
        <div className="announcement-content-2">
          <span className="announcement-quarter-2">Announcement</span>
          <div className="announcement-divider-2"></div>
      
          <span className="announcement-text-2">
            <strong>Spring Fix & Save</strong> — $149 off repairs.
          </span>
      
          <div className="announcement-pill-2">
            <span className="pulse-dot-2"></span>
            Claim Now
          </div>
        </div>
      </a>
    </>
  );
}

export default function AnnouncementBar({ city, offersMembership }) {
  return offersMembership
    ? <AnnouncementBarMembership city={city} />
    : <AnnouncementBarStandard city={city} />;
}
