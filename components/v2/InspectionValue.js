'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Problem → Before/After → Benefits ──────────────────────────────────────
   Replaces the old "Why inspect now" section. Self-contained: inline styles,
   inline SVG icons, no external deps. Brand purple #7C3AED, Inter Tight. */

// TODO: placeholder (burning wood) — swap for real Premium Chimneys photos
const BURNING_WOOD = 'https://images.unsplash.com/photo-1543005472-1b1d37fa4eae?auto=format&fit=crop&w=800&q=80';
const CARD_IMAGES = [BURNING_WOOD, BURNING_WOOD, BURNING_WOOD, BURNING_WOOD, BURNING_WOOD];

const BENEFITS = [
  {
    key: 'fire',
    title: 'Fire safety',
    body: 'Stops a house fire before it ever starts',
    icon: (
      <svg className="ps-ic ps-ic-fire" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          className="ps-flame"
          d="M12 2.5c.6 2.6-1 4-2.4 5.4C8 9.4 7 10.8 7 13a5 5 0 0 0 10 0c0-1.8-.7-3.2-1.6-4.6-.5-.8-.9-1.7-.9-2.6 0 0-1.5 1-1.8 2.6C12 7 12.8 4.5 12 2.5Z"
          fill="#7C3AED"
        />
      </svg>
    ),
  },
  {
    key: 'airflow',
    title: 'Better airflow',
    body: 'Catches the silent killer that is carbon monoxide',
    icon: (
      <svg className="ps-ic ps-ic-air" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path className="ps-air-line ps-air-1" d="M4 16c3 0 3-3 6-3s3 3 6 3" />
        <path className="ps-air-line ps-air-2" d="M4 11c3 0 3-3 6-3s3 3 6 3" />
        <path className="ps-air-line ps-air-3" d="M7 7c2 0 2-2 4-2s2 2 4 2" />
      </svg>
    ),
  },
  {
    key: 'visit',
    title: 'One visit',
    body: 'Saves you from a costly five-figure repair bill',
    icon: (
      <svg className="ps-ic ps-ic-check" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9.25" />
        <path className="ps-check-path" d="M8 12.3l2.6 2.6L16 9.5" />
      </svg>
    ),
  },
  {
    key: 'cracks',
    body: 'Protects your home insurance payout from denial',
  },
  {
    key: 'air',
    body: 'Makes your fireplace run cleaner and far cheaper',
  },
];

// ServiceRoot flames submark — same vector the bottom CTA uses (own gradient id
// so the two SVGs don't collide on the page).
function FlamesMark({ style }) {
  return (
    <svg viewBox="0 0 472 499" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={style}>
      <defs>
        <linearGradient id="psCtaMarkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="52%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
      <path d="M471.118 264.071C468.562 208.05 438.118 169.873 385.036 153.777C351.175 143.545 315.623 138.879 280.689 133.114C236.436 125.805 191.559 122.211 147.738 113.038C83.2356 99.5767 34.7784 64.6791 8.93783 0C8.44329 22.7979 6.35543 45.6311 7.69423 68.3834C11.9879 139.963 47.7049 189.195 116.035 212.922C136.723 220.069 158.154 225.672 179.709 229.963L251.988 241.366C288.579 248.302 326.133 256.061 363.414 269.697C410.208 286.755 445.71 318.075 467.188 357.738C468.831 326.453 472.515 295.248 471.118 264.071Z" fill="url(#psCtaMarkGrad)" />
      <path d="M341.158 330.66C301.772 316.27 259.566 308.894 218.126 301.04C139.88 286.21 60.208 275.651 6.56322 198.594C-2.24342 239.582 -3.76845 273.974 11.9287 307.825C33.2522 353.806 74.1029 374.243 119.181 385.615C173.25 399.253 228.515 408.073 283.104 419.723C336.364 431.088 388.482 445.101 419.599 498.392C440.2 423.829 409.598 355.665 341.158 330.66Z" fill="url(#psCtaMarkGrad)" />
    </svg>
  );
}

export default function InspectionValue({ city, landing }) {
  // ── landing_v2 bindings (fall back to built-in copy/images when absent) ──
  const problemHeading = landing?.problem_heading || 'Worried something is wrong with your chimney?';
  const problemText = landing?.problem_text || 'Odd smells, smoke backing up, or staining are early warning signs worth a closer look.';
  const solutionHeading = landing?.solution_heading || 'Ready to get your chimney clean and safe again?';
  const solutionText = landing?.solution_text || 'One thorough sweep clears the buildup, restores airflow, and makes it safe to light again.';
  const benefitsHeading = landing?.benefits_heading || 'Explore the benefits of getting your chimney inspected:';
  const beforeImage = landing?.before_image || 'https://images.unsplash.com/photo-1543599538-a6c4f6cc5c05?auto=format&fit=crop&w=1400&q=80';
  const afterImage = landing?.after_image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80';
  const benefitCards = [1, 2, 3, 4, 5].map((n, i) => ({
    body: landing?.[`benefit_${n}_desc`] || BENEFITS[i].body,
    img: landing?.[`benefit_${n}_image`] || CARD_IMAGES[i],
  }));

  // ── Before/after slider ──
  const sliderRef = useRef(null);
  const [pos, setPos] = useState(50);
  const [baReveal, setBaReveal] = useState(false); // mobile: CSS transition active
  const draggingRef = useRef(false);

  const isMobileBA = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(max-width: 960px)').matches;

  const setFromClientX = (clientX) => {
    const el = sliderRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  };

  const onPointerDown = (e) => {
    if (isMobileBA()) return; // mobile auto-reveals on scroll; no manual drag
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => { draggingRef.current = false; };

  // ── Mobile: auto-reveal the "after" image once the slider scrolls into view ──
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !isMobileBA()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') { setPos(12); return; }

    setPos(92); // start showing mostly the dirty "before"
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          setBaReveal(true); // arm the CSS transition
          // wait for the transition style to commit, then sweep to reveal "after"
          requestAnimationFrame(() => requestAnimationFrame(() => setPos(12)));
          obs.disconnect();
        }
      }),
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Check-draw on scroll into view ──
  const checkRef = useRef(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const el = checkRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setChecked(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { setChecked(true); obs.disconnect(); }
      }),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Education section — heading, problem/fix rectangles, before/after, benefits, gallery */}
      <section className="ps-section" id="education">
        <div className="ps-inner">

          <div className="ps-frame-head">
            <h2 className="ps-frame-title">How our team helps you and your home</h2>
          </div>

          {/* ── Two orbed rectangles ── */}
          <div className="ps-duo">
            <div className="ps-rect ps-rect-red">
              <span className="ps-rect-icon ps-rect-icon-red" aria-hidden="true">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="psWarnBody" x1="30" y1="14" x2="92" y2="104" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#ff7a52" />
                      <stop offset="0.55" stopColor="#f0402f" />
                      <stop offset="1" stopColor="#c4161c" />
                    </linearGradient>
                    <linearGradient id="psWarnRim" x1="60" y1="16" x2="60" y2="100" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#ffd0c0" stopOpacity="0.95" />
                      <stop offset="1" stopColor="#7a0a10" stopOpacity="0.5" />
                    </linearGradient>
                    <radialGradient id="psWarnGlow" cx="60" cy="66" r="54" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#ff4632" stopOpacity="0.55" />
                      <stop offset="1" stopColor="#ff4632" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="psWarnMark" x1="60" y1="46" x2="60" y2="90" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#fff7f4" />
                      <stop offset="1" stopColor="#ffd9cd" />
                    </linearGradient>
                  </defs>

                  {/* ambient glow */}
                  <circle cx="60" cy="66" r="54" fill="url(#psWarnGlow)" />

                  {/* rounded triangle body */}
                  <path
                    d="M67.42 30.18 L96.58 85.82 Q104 100 88 100 L32 100 Q16 100 23.42 85.82 L52.58 30.18 Q60 16 67.42 30.18 Z"
                    fill="url(#psWarnBody)" stroke="url(#psWarnRim)" strokeWidth="2.5" strokeLinejoin="round"
                  />

                  {/* top gloss highlight */}
                  <path d="M60 26 L78 60 Q60 53 42 60 Z" fill="#ffffff" opacity="0.12" />

                  {/* exclamation — tapered bar + dot */}
                  <path d="M55.6 51 A4.4 4.4 0 0 1 64.4 51 L63.4 71 A3.4 3.4 0 0 1 56.6 71 Z" fill="url(#psWarnMark)" />
                  <circle cx="60" cy="83" r="4.6" fill="url(#psWarnMark)" />
                </svg>
              </span>
              <p className="ps-rect-q">{problemHeading}</p>
              <p className="ps-rect-sub">{problemText}</p>
            </div>
            <div className="ps-rect ps-rect-green">
              <span className="ps-rect-icon ps-rect-icon-green" aria-hidden="true">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="psFixBody" x1="30" y1="14" x2="92" y2="104" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#5ce98c" />
                      <stop offset="0.55" stopColor="#1fa84f" />
                      <stop offset="1" stopColor="#0a7a37" />
                    </linearGradient>
                    <linearGradient id="psFixRim" x1="60" y1="18" x2="60" y2="100" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#cfffe0" stopOpacity="0.95" />
                      <stop offset="1" stopColor="#064d22" stopOpacity="0.5" />
                    </linearGradient>
                    <radialGradient id="psFixGlow" cx="60" cy="62" r="54" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#22c55e" stopOpacity="0.55" />
                      <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="psFixMark" x1="60" y1="44" x2="60" y2="76" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#f4fff8" />
                      <stop offset="1" stopColor="#d6ffe6" />
                    </linearGradient>
                  </defs>

                  {/* ambient glow */}
                  <circle cx="60" cy="62" r="54" fill="url(#psFixGlow)" />

                  {/* rounded shield body */}
                  <path
                    d="M34 28 L86 28 Q94 28 94 36 L94 58 Q94 80 60 99 Q26 80 26 58 L26 36 Q26 28 34 28 Z"
                    fill="url(#psFixBody)" stroke="url(#psFixRim)" strokeWidth="2.5" strokeLinejoin="round"
                  />

                  {/* top gloss highlight */}
                  <path d="M34 38 Q60 30 86 38 Q60 48 34 38 Z" fill="#ffffff" opacity="0.12" />

                  {/* checkmark */}
                  <path d="M45 61 L55 71 L76 49" stroke="url(#psFixMark)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
              <p className="ps-rect-q">{solutionHeading}</p>
              <p className="ps-rect-sub">{solutionText}</p>
            </div>
          </div>

          {/* ── Before / After slider (under the two rectangles) ── */}
          {/* TODO: replace with real before/after job photos */}
          <div
            className={`ps-ba${baReveal ? ' ps-ba--reveal' : ''}`}
            ref={sliderRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="slider"
            aria-label="Before and after chimney sweep comparison"
            aria-valuenow={Math.round(pos)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {/* AFTER — clean */}
            <img
              className="ps-ba-img"
              src={afterImage}
              alt="After: clean, freshly swept fireplace"
              draggable="false"
            />
            {/* BEFORE — dirty, clipped to the handle position */}
            <img
              className="ps-ba-img ps-ba-before"
              src={beforeImage}
              alt="Before: dirty, creosote-caked flue"
              draggable="false"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            />

            <span className="ps-ba-pill ps-ba-pill-before">Before</span>
            <span className="ps-ba-pill ps-ba-pill-after">After</span>

            <div className="ps-ba-handle" style={{ left: `${pos}%` }} aria-hidden="true">
              <span className="ps-ba-grip">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 8 4 12 9 16" /><polyline points="15 8 20 12 15 16" />
                </svg>
              </span>
            </div>
          </div>
          <p className="ps-ba-cap">Drag to see the difference.</p>

          {/* ── Composed card: benefit cards ── */}
          <div className="ps-frame">

            <h3 className="ps-card-heading">{benefitsHeading}</h3>

          {/* ── Benefit cards — endless slow marquee (set duplicated for seamless loop) ── */}
          <div className="ps-carousel">
            <div className="ps-track">
              {[...benefitCards, ...benefitCards].map((b, i) => (
                <div className="ps-benefit" key={i} aria-hidden={i >= benefitCards.length ? 'true' : undefined}>
                  <img
                    className="ps-card"
                    src={b.img}
                    alt=""
                    loading="lazy"
                    draggable="false"
                  />
                  <p className="ps-card-body">{b.body}</p>
                </div>
              ))}
            </div>
          </div>

          </div>{/* ── end composed card ── */}

          {/* ── CTA banner — dark closer style, horizontal ── */}
          <div className="ps-cta">
            {/* Large flames submark bleeding off the edges, lit from within */}
            <FlamesMark
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 'min(130%, 1200px)',
                height: 'auto',
                transform: 'translate(-50%, -50%)',
                opacity: 0.3,
                pointerEvents: 'none',
                zIndex: 0,
                filter:
                  'drop-shadow(0 0 60px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 150px rgba(124, 58, 237, 0.4))',
              }}
            />
            <span aria-hidden="true" className="ps-cta-halo" />
            <span aria-hidden="true" className="ps-cta-scrim" />

            <div className="ps-cta-main">
              <span className="ps-cta-eyebrow">
                <span className="ps-cta-dot" aria-hidden="true" />
                Let's get started
              </span>
              <h3 className="ps-cta-heading">Not sure what you need?<br className="ps-cta-br" /> Just ask!</h3>
              <p className="ps-cta-desc">You don't have to figure this out alone. We make it simple from the first call.</p>
            </div>
            <div className="ps-cta-actions">
              <span className="hero-cta-wrap">
                <a href={`tel:${city?.phone ?? ''}`} className="hero-cta-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {city?.phone_text}
                </a>
                <span className="hero-cta-badge">ON STANDBY</span>
              </span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap');

  .ps-section {
    background: transparent;
    font-family: 'Inter Tight', sans-serif;
  }
  .ps-inner { position: relative; max-width: 1200px; margin: 0 auto; padding: 128px 24px 56px; }

  /* ── Two orbed rectangles ── */
  .ps-duo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 80px;
  }
  .ps-rect {
    position: relative;
    overflow: hidden;
    min-height: 200px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 18px 50px rgba(6, 3, 12, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
  .ps-rect-red,
  .ps-rect-green {
    display: flex;
    flex-direction: column;
    padding: 28px;
  }
  .ps-rect-icon {
    position: absolute;
    top: -48px; right: -48px;
    width: 188px; height: 188px;
    opacity: 0.5;
    transform: rotate(12deg);
    pointer-events: none;
  }
  .ps-rect-icon svg { width: 100%; height: 100%; display: block; }
  .ps-rect-icon-green { top: -43px; right: -43px; }
  .ps-rect-icon-red svg { filter: drop-shadow(0 6px 24px rgba(255, 59, 48, 0.45)); }
  .ps-rect-icon-green svg { filter: drop-shadow(0 6px 24px rgba(34, 197, 94, 0.45)); }
  .ps-rect-q {
    margin: auto 0 0;
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: #ffffff;
    max-width: 22ch;
  }
  .ps-rect-sub {
    margin: 10px 0 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.6);
    max-width: 34ch;
  }
  .ps-rect-red {
    background:
      radial-gradient(circle 300px at 24% 26%, rgba(255, 45, 40, 0.16), transparent 70%),
      radial-gradient(circle 220px at 82% 78%, rgba(180, 22, 22, 0.13), transparent 70%),
      linear-gradient(155deg, #1c0808 0%, #0a0303 72%);
  }
  .ps-rect-green {
    background:
      radial-gradient(circle 300px at 24% 26%, rgba(34, 197, 94, 0.15), transparent 70%),
      radial-gradient(circle 220px at 82% 78%, rgba(16, 140, 72, 0.12), transparent 70%),
      linear-gradient(155deg, #07160d 0%, #030a06 72%);
  }

  /* ── Composed card ── */
  .ps-frame {
    position: relative;
    overflow: hidden;
    margin-top: 80px;
    border-radius: 20px;
    padding: 64px 36px;
    background: #ffffff;
    border: none;
    box-shadow: none;
  }
  .ps-frame > * { position: relative; z-index: 1; }
  .ps-frame-head { text-align: center; margin-bottom: 40px; }
  .ps-frame-title {
    width: 100%;
    font-size: 48px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #1a1225;
    margin: 0;
  }
  .ps-card-heading {
    margin: 0 0 32px;
    text-align: center;
    font-size: clamp(1.5rem, 2.6vw, 1.875rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: #1a1225;
  }

  /* ── Before/after slider ── */
  .ps-ba {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 21 / 9;
    background: #f0f0f2;
    cursor: ew-resize;
    touch-action: pan-y;
    user-select: none;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.06);
  }
  .ps-ba-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
  }
  .ps-ba-pill {
    position: absolute; top: 14px;
    padding: 8px;
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: #fff;
    background: rgba(20, 20, 24, 0.62);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border-radius: 8px;
    pointer-events: none;
  }
  .ps-ba-pill-before { left: 14px; }
  .ps-ba-pill-after  { right: 14px; background: rgba(124, 58, 237, 0.78); }
  .ps-ba-handle {
    position: absolute; top: 0; bottom: 0;
    width: 3px;
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(-50%);
    pointer-events: none;
    box-shadow: 0 0 0 1px rgba(16, 24, 40, 0.08);
  }
  .ps-ba-grip {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    background: #fff;
    border-radius: 100px;
    box-shadow: 0 2px 10px rgba(16, 24, 40, 0.25);
  }
  .ps-ba-grip svg { width: 20px; height: 20px; display: block; }
  .ps-ba-cap {
    text-align: center;
    font-size: 0.85rem;
    color: #6b5b86;
    margin: 12px 0 0;
  }

  /* ── Part 3: benefit cards — endless marquee ── */
  .ps-carousel {
    overflow: hidden;
    margin-left: -36px;
    margin-right: -36px;
  }
  .ps-track {
    display: flex;
    width: max-content;
    animation: ps-marquee 80s linear infinite;
  }
  .ps-benefit {
    flex: 0 0 320px;
    width: 320px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
  }
  @keyframes ps-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .ps-track { animation: none; }
  }
  .ps-card {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    background: #ececef;
    border: 1px solid #e3e3e8;
    border-radius: 16px;
  }
  .ps-icon-wrap {
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 12px;
    background: #f3eefe;
    margin-bottom: 16px;
  }
  .ps-ic { width: 26px; height: 26px; display: block; }
  .ps-card-title {
    font-size: 1.1875rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: #1a1a1a;
    margin: 0 0 4px;
  }
  .ps-card-body {
    font-size: 1.0625rem;
    line-height: 1.2;
    font-weight: 600;
    color: #1a1a1a;
    text-align: left;
    padding-left: 16px;
    padding-right: 16px;
    margin: 14px 0 0;
  }

  /* ── Icon motion (functional, contained) ── */
  .ps-check-path { stroke-dasharray: 16; stroke-dashoffset: 16; }
  .ps-icon-wrap.is-in .ps-check-path {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.5s ease-out 0.05s;
  }
  @media (prefers-reduced-motion: reduce) {
    .ps-check-path { stroke-dashoffset: 0; transition: none; }
  }
  @media (prefers-reduced-motion: no-preference) {
    .ps-flame {
      transform-box: fill-box;
      transform-origin: 50% 100%;
      animation: ps-flicker 2.5s ease-in-out infinite alternate;
    }
    .ps-air-line { animation: ps-drift 2.8s ease-in-out infinite; }
    .ps-air-2 { animation-delay: 0.25s; }
    .ps-air-3 { animation-delay: 0.5s; }
  }
  @keyframes ps-flicker {
    0%   { transform: scale(1);    opacity: 0.9; }
    100% { transform: scale(1.07); opacity: 1; }
  }
  @keyframes ps-drift {
    0%, 100% { transform: translateY(0.6px); }
    50%      { transform: translateY(-1.4px); }
  }

  /* ── CTA banner — dark closer style, horizontal ── */
  .ps-cta {
    margin-top: 56px;
    border-radius: 24px;
    padding: 44px 48px;
    background:
      radial-gradient(ellipse 90% 70% at 50% 4%, rgba(124, 58, 237, 0.22) 0%, rgba(124, 58, 237, 0) 60%),
      #050507;
    border: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
  }
  .ps-cta-halo {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(circle 520px at 50% 46%, rgba(167, 139, 250, 0.28) 0%, rgba(124, 58, 237, 0) 60%);
  }
  .ps-cta-scrim {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background: linear-gradient(180deg, rgba(5,5,7,0.30) 0%, rgba(5,5,7,0.50) 50%, rgba(5,5,7,0.30) 100%);
  }
  .ps-cta-main { position: relative; z-index: 1; flex: 1; min-width: 300px; text-align: left; }
  .ps-cta-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px 6px 12px; border-radius: 999px;
    background: rgba(124, 58, 237, 0.14);
    border: 1px solid rgba(124, 58, 237, 0.32);
    color: #c4b5fd;
    font-size: 12.5px; font-weight: 600;
    letter-spacing: .04em;
  }
  .ps-cta-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #a78bfa;
    box-shadow: 0 0 8px 1px rgba(167, 139, 250, 0.9);
  }
  .ps-cta-heading {
    margin: 16px 0 0;
    font-size: clamp(26px, 3.4vw, 36px);
    font-weight: 800; line-height: 1.1;
    letter-spacing: -.03em; color: #ffffff;
  }
  .ps-cta-br { display: none; }
  .ps-cta-desc {
    margin: 12px 0 0;
    font-size: 15.5px; line-height: 1.5;
    color: rgba(255,255,255,.8);
    max-width: 48ch;
  }
  .ps-cta-actions { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; flex-shrink: 0; align-self: flex-end; }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    .ps-inner { padding: 24px 20px; }
    .ps-frame-title { font-size: 36px; }
    .ps-frame-head { margin-bottom: 24px; text-align: left; }
    .ps-duo { grid-template-columns: 1fr; gap: 24px; margin-bottom: 24px; }
    .ps-frame { padding: 24px; margin-top: 24px; }
    .ps-carousel { margin-left: -24px; margin-right: -24px; }
    .ps-benefit { flex: 0 0 240px; width: 240px; margin-right: 16px; }
    .ps-ba { aspect-ratio: 16 / 9; cursor: default; }
    /* Mobile auto-reveal: smooth one-shot sweep instead of manual drag.
       Grip (ellipse + chevrons) hidden so it doesn't read as draggable. */
    .ps-ba-grip { display: none; }
    .ps-ba--reveal .ps-ba-before { transition: clip-path 5s cubic-bezier(0.45, 0, 0.2, 1); }
    .ps-ba--reveal .ps-ba-handle { transition: left 5s cubic-bezier(0.45, 0, 0.2, 1); }
    .ps-ba-cap { display: none; }
    .ps-cta { margin-top: 24px; padding: 24px; }
    .ps-cta-br { display: inline; }
    /* Benefit images: white card bg (not light gray), desktop 16px radius kept */
    .ps-card { background: #ffffff; }
  }
  @media (max-width: 480px) {
    .ps-inner { padding: 24px 16px; }
    .ps-frame { padding: 24px 16px; }
    .ps-carousel { margin-left: -16px; margin-right: -16px; }
    /* Full-width CTA button in the "Not sure what you need?" banner (scoped so it doesn't touch the hero CTA) */
    .ps-cta-actions { width: 100%; align-self: stretch; }
    .ps-cta-actions .hero-cta-wrap { display: block; width: 100%; }
    .ps-cta-actions .hero-cta-primary { width: 100%; }
  }
`;
