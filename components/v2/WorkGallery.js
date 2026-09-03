'use client';

// V2's own copy of the work gallery — see the note in
// components/variants/ServicePageV2.js. Editing this file never touches V1.
// The slide data is shared (lib/serviceGallery.js) because both variants show
// the same jobs; only the layout is ever under test.

import { useCallback, useEffect, useRef, useState } from 'react';
import { getServiceGallery } from '@/lib/serviceGallery';

const CheckIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function serviceNameFromSlug(slug) {
  return String(slug || '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function WorkGallery({ city, service, serviceData }) {
  const slides = getServiceGallery(service, serviceData?.service_gallery);
  const serviceName = serviceNameFromSlug(service);
  const cityName = city?.name ? city.name.split(',')[0].trim() : null;

  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, x: 0, lastX: 0, lastT: 0, v: 0, pointerId: null });
  // Every scroll this component performs is animated here rather than by the
  // browser. `behavior: 'smooth'` is a short, near-linear ramp that lands with
  // a stop; a long cubic ease-out is what actually reads as gliding.
  const anim = useRef(0);
  const dragFrame = useRef(0);
  // One card plus one gap. Measured rather than hard-coded — the card width is
  // a clamp() — but cached, because reading it is a forced style calculation
  // and the scroll handler below runs on every frame of a swipe.
  const stepRef = useRef(0);
  const frame = useRef(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !card) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    stepRef.current = card.getBoundingClientRect().width + gap;
    return stepRef.current;
  }, []);

  const step = useCallback(() => stepRef.current || measure(), [measure]);

  // Only which end we are at — that is all the arrows need.
  const read = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft >= max - 2);
  }, []);

  // Coalesce to one read per frame: a swipe fires scroll events faster than the
  // display refreshes, and each read touches layout.
  const sync = useCallback(() => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      read();
    });
  }, [read]);

  useEffect(() => {
    const onResize = () => { measure(); read(); };
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (frame.current) cancelAnimationFrame(frame.current);
      if (anim.current) cancelAnimationFrame(anim.current);
      if (dragFrame.current) cancelAnimationFrame(dragFrame.current);
    };
  }, [measure, read]);

  const stopAnim = () => {
    if (anim.current) cancelAnimationFrame(anim.current);
    anim.current = 0;
  };

  const clamp = (value) => {
    const track = trackRef.current;
    return Math.max(0, Math.min(track.scrollWidth - track.clientWidth, value));
  };

  const glideTo = (target, duration = 640) => {
    const track = trackRef.current;
    if (!track) return;
    stopAnim();
    const to = clamp(target);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      track.scrollLeft = to;
      return;
    }
    const from = track.scrollLeft;
    const distance = to - from;
    if (Math.abs(distance) < 1) return;
    const started = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - started) / duration);
      // Ease-out quint: most of the distance is covered early, and the last
      // few pixels drift in rather than arriving.
      track.scrollLeft = from + distance * (1 - Math.pow(1 - t, 5));
      anim.current = t < 1 ? requestAnimationFrame(tick) : 0;
    };
    anim.current = requestAnimationFrame(tick);
  };

  // One card's worth from wherever the track currently sits — deliberately not
  // to the nearest card edge. Re-aligning would move the row by a few pixels
  // the reader did not ask for, which is the same thing that made the old
  // settle-after-a-throw feel like the carousel was correcting them.
  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    glideTo(track.scrollLeft + direction * (step() || track.clientWidth * 0.8));
  };

  // Carry the throw and stop wherever it runs out. Decay is per frame, so a
  // flick travels for about half a second and a slow release barely moves.
  const fling = (velocity) => {
    const track = trackRef.current;
    if (!track || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let v = velocity;
    stopAnim();
    const tick = () => {
      v *= 0.94;
      const next = track.scrollLeft + v * 16.7;
      const stopped = Math.abs(v) < 0.03 || next <= 0 || next >= track.scrollWidth - track.clientWidth;
      track.scrollLeft = clamp(next);
      if (stopped) { anim.current = 0; return; }
      anim.current = requestAnimationFrame(tick);
    };
    anim.current = requestAnimationFrame(tick);
  };

  // Mouse drag. Touch already scrolls natively — with its own momentum — and
  // dragging with a pen or a finger here would fight the browser's panning.
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const track = trackRef.current;
    stopAnim();
    drag.current = {
      active: true, startX: e.clientX, startLeft: track.scrollLeft,
      x: e.clientX, lastX: e.clientX, lastT: performance.now(), v: 0, pointerId: e.pointerId,
    };
    track.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  // A gaming mouse reports faster than the screen redraws, so the pointer only
  // records where it is; the scroll position is written once per frame.
  const applyDrag = () => {
    dragFrame.current = 0;
    const d = drag.current;
    const track = trackRef.current;
    if (!d.active || !track) return;
    const now = performance.now();
    const elapsed = now - d.lastT;
    if (elapsed > 0) {
      // Smoothed, so one jittery sample at release cannot throw the fling.
      d.v = d.v * 0.7 + ((d.lastX - d.x) / elapsed) * 0.3;
      d.lastX = d.x;
      d.lastT = now;
    }
    track.scrollLeft = d.startLeft - (d.x - d.startX);
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    e.preventDefault();
    drag.current.x = e.clientX;
    if (!dragFrame.current) dragFrame.current = requestAnimationFrame(applyDrag);
  };

  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    const track = trackRef.current;
    if (track.hasPointerCapture?.(d.pointerId)) track.releasePointerCapture(d.pointerId);
    d.active = false;
    setDragging(false);
    if (dragFrame.current) { cancelAnimationFrame(dragFrame.current); dragFrame.current = 0; }
    fling(d.v);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="wg" aria-labelledby="wgTitle">
        <div className="wg-bg" aria-hidden="true" />
        <div className="wg-container">

          <div className="wg-head">
            <div className="wg-head-text">
              <span className="wg-eyebrow">
                <svg className="wg-eye" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1.8 12S5.4 5.4 12 5.4 22.2 12 22.2 12 18.6 18.6 12 18.6 1.8 12 1.8 12z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <circle className="wg-eye-pupil" cx="12" cy="12" r="2.7" fill="currentColor" />
                </svg>
                Project Gallery
              </span>
              <h2 className="wg-title" id="wgTitle">
                Explore projects we&rsquo;ve completed for <span className="wg-title-accent">our customers</span>
              </h2>
              <p className="wg-lede">
                We take pride in providing excellent service for our incredible homeowners
                {cityName ? ` in ${cityName}` : ''}. We complete each project as if we were working
                on our own home.
              </p>
            </div>

            <div className="wg-nav">
              <button
                type="button"
                className="wg-arrow"
                onClick={() => move(-1)}
                disabled={atStart}
                aria-label="Previous project"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button
                type="button"
                className="wg-arrow"
                onClick={() => move(1)}
                disabled={atEnd}
                aria-label="Next project"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Outside the 1200px container on purpose: the track runs the full
            width of the viewport and carries the container's gutter as its own
            padding, so the first card lines up under the heading while the rest
            of the row keeps going past both edges of the screen. */}
        <ul
          className={`wg-track${dragging ? ' is-dragging' : ''}`}
          ref={trackRef}
          onScroll={sync}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-label={`${serviceName} project photos`}
        >
          {slides.map((s, i) => (
            <li className="wg-card" key={i}>
              <figure className="wg-figure">
                <div className="wg-media">
                  <img
                    className="wg-img"
                    src={s.img}
                    /* Only where a 640w sibling was actually uploaded — the
                       rest are single files whose source was already smaller
                       than the slot. */
                    srcSet={s.small ? `${s.small} 640w, ${s.img} 920w` : undefined}
                    sizes={s.small ? '(max-width: 640px) 84vw, (max-width: 900px) 420px, 460px' : undefined}
                    alt={s.alt}
                    /* Below the fold. Without loading="lazy" React emits a
                       <link rel="preload"> for every slide during SSR, putting
                       five photos nobody has scrolled to yet up against the
                       hero image. */
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                  <div className="wg-media-shade" aria-hidden="true" />
                  <span className="wg-chip">{s.scope}</span>
                </div>
                <figcaption className="wg-cap">
                  <h3 className="wg-cap-title">{s.title}</h3>
                  <div className="wg-meta">
                    <span className="wg-meta-item">{CheckIcon}{s.result}</span>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

const css = `
  .wg {
    position: relative;
    background: #faf9fe;
    padding: 104px 0 64px;
    overflow: hidden;
    font-family: 'Inter Tight', sans-serif;
  }
  /* Opens where the dark hero ends and lands on the flat #faf9fe that
     "What to expect" starts from, so the two light sections meet without a
     visible seam. */
  .wg-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 55% 40% at 82% 10%, rgba(167,139,250,0.20), transparent 70%),
      radial-gradient(ellipse 40% 30% at 6% 40%, rgba(232,121,249,0.09), transparent 70%),
      linear-gradient(180deg, #f4efff 0%, #faf9fe 58%, #faf9fe 100%);
    pointer-events: none;
  }
  .wg-container { position: relative; max-width: 1200px; margin: 0 auto; padding: 0 24px; }

  .wg-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    margin-bottom: 40px;
  }
  .wg-head-text { max-width: 700px; }

  .wg-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 7px 14px;
    border-radius: 100px;
    background: rgba(167,139,250,0.10);
    border: 1px solid rgba(167,139,250,0.28);
    color: #6d28d9;
    /* Set as written. The wide tracking that made the old all-caps label
       readable would only pull these letters apart, so it comes off with it. */
    font-size: 13px; font-weight: 600;
    letter-spacing: 0.005em;
    margin-bottom: 18px;
  }
  /* The eye glances left, then right, then blinks. Both are transforms on a
     15px glyph, so the whole thing is a compositor job — and AnimationGate
     parks it whenever the section is off screen. */
  .wg-eye { flex-shrink: 0; transform-origin: center; animation: wg-blink 7s ease-in-out infinite; }
  .wg-eye-pupil { transform-origin: center; animation: wg-look 7s ease-in-out infinite; }
  @keyframes wg-look {
    0%, 14%   { transform: translateX(0); }
    24%, 38%  { transform: translateX(2.6px); }
    48%, 62%  { transform: translateX(-2.6px); }
    72%, 100% { transform: translateX(0); }
  }
  @keyframes wg-blink {
    0%, 86%, 100% { transform: scaleY(1); }
    90%           { transform: scaleY(0.12); }
    94%           { transform: scaleY(1); }
  }

  .wg-title {
    font-size: 44px; font-weight: 700; line-height: 1.08;
    letter-spacing: -0.04em; margin: 0 0 14px;
    color: #1a1225;
    text-wrap: balance;
  }
  @keyframes wgShimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  .wg-title-accent {
    background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: wgShimmer 4s ease-in-out infinite;
  }
  /* Narrower than the heading block so the paragraph stops roughly where the
     headline does instead of running past it. */
  .wg-lede { font-size: 16px; line-height: 1.65; color: #6b5b86; margin: 0; max-width: 540px; }

  .wg-nav { display: flex; gap: 10px; flex-shrink: 0; padding-bottom: 4px; }
  .wg-arrow {
    width: 46px; height: 46px;
    display: grid; place-items: center;
    border-radius: 14px;
    color: #6d28d9;
    background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5));
    border: 1px solid rgba(167,139,250,0.4);
    box-shadow: 0 10px 26px rgba(91,33,182,0.10), inset 0 1px 0 rgba(255,255,255,0.8);
    cursor: pointer;
    transition: border-color .18s ease, color .18s ease, opacity .18s ease;
  }
  /* These two are the exception: they are buttons, and a control with no
     hover state reads as decoration. It tints — it does not move. */
  .wg-arrow:hover:not(:disabled) { border-color: rgba(124,58,237,0.65); color: #5b21b6; }
  .wg-arrow:disabled { opacity: 0.35; cursor: default; }

  /* The gutter that puts the first card directly under the heading: the same
     distance the 1200px container is inset by. As padding it keeps the row
     aligned; as scroll-padding it makes cards snap to that line instead of to
     the edge of the screen — and because it is padding rather than a margin,
     the card you just scrolled past stays visible inside it, running off the
     left edge the way the ones ahead run off the right. */
  .wg-track {
    --wg-gutter: max(24px, calc((100% - 1200px) / 2 + 24px));
    /* .wg-bg is absolutely positioned, so it paints above anything in normal
       flow — which is what swallowed the captions once the track moved out of
       the (positioned) container. */
    position: relative;
    z-index: 1;
    display: flex;
    gap: 24px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-padding-left: var(--wg-gutter);
    list-style: none;
    margin: 0;
    padding-block: 6px 4px;
    padding-inline: var(--wg-gutter);
    cursor: grab;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .wg-track::-webkit-scrollbar { display: none; }
  .wg-track:focus-visible { outline: 2px solid rgba(124,58,237,0.5); outline-offset: 6px; border-radius: 24px; }
  .wg-track.is-dragging { cursor: grabbing; user-select: none; }

  /* No scroll snapping anywhere, on purpose. The track stops where it is left,
     on a trackpad and under a finger alike — nothing pulls the row to a card
     edge after the fact. */

  .wg-card { flex: 0 0 clamp(300px, 32vw, 460px); }
  .wg-figure { margin: 0; }

  .wg-media {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: 20px;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(167,139,250,0.18), rgba(232,121,249,0.10));
    box-shadow:
      0 18px 44px rgba(91,33,182,0.16),
      0 2px 6px rgba(91,33,182,0.08),
      inset 0 0 0 1px rgba(255,255,255,0.5);
  }
  /* No hover state on the cards. Nothing here responds to a click, so a lift
     and a zoom only promise an interaction that does not exist — and on a
     track you drag through, the cursor crosses every card on the way past. */
  .wg-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }
  .wg-media-shade {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(13,5,28,0.45) 0%, transparent 42%);
    pointer-events: none;
  }
  /* Deliberately not backdrop-filter. A blurred backdrop has to be recomputed
     against whatever is behind it on every frame, and with one on each card
     that was most of the roughness while the track moved. A flat translucent
     ink over the shade below reads the same and costs nothing to scroll. */
  .wg-chip {
    position: absolute; top: 14px; left: 14px;
    padding: 7px 13px;
    border-radius: 100px;
    background: rgba(16,7,32,0.62);
    border: 1px solid rgba(255,255,255,0.22);
    color: #fff;
    font-size: 11.5px; font-weight: 600;
    letter-spacing: 0.03em;
    white-space: nowrap;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  }

  .wg-cap { padding: 18px 4px 0; }
  .wg-cap-title {
    font-size: 17px; font-weight: 700;
    letter-spacing: -0.015em;
    line-height: 1.3;
    color: #1a1225;
    margin: 0 0 10px;
  }
  .wg-meta { display: flex; align-items: center; }
  .wg-meta-item {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12.5px; font-weight: 600;
    color: #6b5b86;
  }
  .wg-meta-item svg { flex-shrink: 0; }


  /* Nothing here animates on its own any more, so reduced motion is handled
     entirely in glideTo/fling, which jump straight to the target. */

  @media (max-width: 900px) {
    .wg { padding: 90px 0 76px; }
    .wg-container { padding: 0 20px; }
    .wg-head { flex-direction: column; align-items: flex-start; gap: 20px; margin-bottom: 30px; }
    .wg-title { font-size: 36px; }
    /* Match the narrower container gutter so the first card still lines up. */
    .wg-track { --wg-gutter: 20px; }
    .wg-card { flex: 0 0 min(420px, 76vw); }
  }

  @media (max-width: 640px) {
    .wg { padding: 76px 0 64px; }
    .wg-container { padding: 0 18px; }
    .wg-title { font-size: 32px; }
    .wg-lede { font-size: 15px; }
    .wg-nav { display: none; }
    .wg-track { --wg-gutter: 18px; gap: 16px; }
    .wg-card { flex: 0 0 84vw; }
  }
`;
