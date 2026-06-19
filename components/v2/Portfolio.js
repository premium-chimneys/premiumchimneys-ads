'use client';

import { useEffect, useRef, useState } from 'react';
import FinalCTA from '@/components/v2/FinalCTA'

/* ── Portfolio (section 3) ──────────────────────────────────────────────────
   Dark, spacious section with ambient orbs. Holds the benefits smart card, then
   the recent-work carousel, then the CTA banner. The carousel is a faithful port
   of the serviceroot "Our products." slideshow (heading + polygon arrows +
   pointer-drag track, 2 cards on desktop / 1 on mobile), recolored for dark. */

// Real Google reviews. `avatar` is the reviewer's Google profile photo; when
// absent we fall back to a generated initial avatar.
const REVIEWS = [
  { name: 'Bonnie A. Crist', avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjWfDA4Fc4EZ0OfXoFpvWUTuUT12Y7JgUmVeacKg7CEDpuK40m1A=w79-h79-p-rp-mo-br100', text: 'Ben with Premium Chimneys was outstanding! He was quick, proficient and knowledgable. He answered all of our questions with patience and diagnosed our chimney issues with ease. He is an expert in this field! My husband and I could not be more thrilled with his cleaning of our chimney and services.' },
  { name: 'Raymond Portley', avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjXGzVUMfP3DcODDlCXdH0AtGjooTWu8AEttu7yKeEpgMzMQmlk=w79-h79-p-rp-mo-br100', text: 'Had a great experience with Idan, came out and helped to solve the problem. I appreciate the time and the patience he had with me, and his explanation on what the problem was. They are a premium company, I recommend them to anyone that needs chimney and fireplace work.' },
  { name: 'Allison McFadden', avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjV7DUEgsqLCi-xxrPX-r85p4EaYbNjIpqmeEW41ZryJOQaEvdVC=w79-h79-p-rp-mo-ba12-br100', text: "I called Premium Chimneys on Friday, November 21st, 2025 and got an inspection scheduled the following Monday, which I couldn't believe, as it was the week before Thanksgiving. We haven't used our chimney in 22 years (house is 51 yrs old) which is crazy, and something told me to get it working again." },
  { name: 'KD', avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjV1RTZ5Gnzc3mdLEZb6VEVSaUWTPZQwoBeFHml9RwweFLUVfWdP3w=w79-h79-p-rp-mo-ba12-br100', text: 'I highly recommend Premium Chimney. The crew, as well as the team member that came out quickly to give us a quote on a Sunday, were so professional, hard-working, and were able to complete our job in less than two hours.' },
  { name: 'Tammie Jacobs', avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjW437g7_SHLU4d1IX1ZzhDBGaSHo0R4sQeLTyM_6UVkvuLICYVT=w79-h79-p-rp-mo-br100', text: 'Idan, Alex and Ben came to inspect my chimney. I did not know it was so old. Due to their knowledge and expertise they were able to repair the old chimney to look like new, and just in time for the holidays as promised. They were wonderful, very professional and very friendly.' },
  { name: 'Roy Fowler', avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjU1g8ph6czTEyCpcNUxHjaX8rHwevKjdoO5TmcBWwkEt0tm5NR-=w79-h79-p-rp-mo-ba12-br100', text: 'Amit (technician) is exceptionally personable and very skilled at his assessment ability. While the offers of a new fireplace are very tempting, we have decided to find a maintenance tech who might be able to restore our current setup.' },
  { name: 'Janet Haley', avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjU_hnITt2siQA6zYINskb-P0BcQnmwJpgzDDz6rxPnxDx7htsQ4=w79-h79-p-rp-mo-br100', text: 'This is the 5th company we had look at fixing our fireplace! We have waited 2 years for this fireplace to work and Premium Chimneys has professionally solved our issues. Thank you. They really are PREMIUM!' },
  { name: 'Abby Cotton', avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjWfyjsEwY2mEAqFkfEjn05WVbZ8NLBo7lLu-7yCyMkr-9A0CjzGbQ=w79-h79-p-rp-mo-br100', text: 'Idan did an amazing job cleaning our chimney. He was on time, professional, and explained everything clearly. You can tell he takes pride in his work. Our chimney looks great, and the whole process was super smooth. Highly recommend!' },
];

const avatarUrl = (name) =>
  `https://placehold.co/96x96/1a1030/c4b5fd?text=${encodeURIComponent(name.charAt(0))}`;

const RATING = { score: '4.9', count: 216 };
const RATING_DIST = [
  { stars: 5, pct: 94 },
  { stars: 4, pct: 4 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 0 },
  { stars: 1, pct: 1 },
];

const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z';

function GoogleLogo() {
  return (
    <svg className="rv-google" viewBox="0 0 24 24" aria-label="Google review">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function Stars({ className = 'rv-stars' }) {
  return (
    <span className={className} aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

// Placeholder Unsplash imagery — swap for real Premium Chimneys job photos.
const tiles = [
  { label: 'Chimney Rebuild', id: 'photo-1556009762-36a907690bda' },
  { label: 'Crown Repair', id: 'photo-1588712757679-06a3428ce119' },
  { label: 'Full Masonry Restoration', id: 'photo-1604413950933-073730fba9f2' },
  { label: 'Cap Installation', id: 'photo-1513321203182-6146b02eadef' },
  { label: 'Liner Replacement', id: 'photo-1609874491280-5be6de8780ab' },
  { label: 'Tuckpointing', id: 'photo-1627367420115-67487e59f498' },
];

function PolygonLeft() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="8,2 4,6 8,10" />
    </svg>
  );
}

function PolygonRight() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="4,2 8,6 4,10" />
    </svg>
  );
}

export default function Portfolio({ city, landing }) {
  // gallery_1_image…gallery_6_image from landing_v2, falling back to placeholders.
  const galleryTiles = tiles.map((t, i) => ({
    label: t.label,
    src: landing?.[`gallery_${i + 1}_image`] || `https://images.unsplash.com/${t.id}?auto=format&fit=crop&w=800&h=800&q=80`,
  }));

  const [index, setIndex] = useState(0);
  // cardsPerView is read from a CSS media query to keep JS + CSS in sync.
  const [cardsPerView, setCardsPerView] = useState(2);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 720px)');
    const update = () => setCardsPerView(mql.matches ? 1 : 2);
    update();
    if (mql.addEventListener) mql.addEventListener('change', update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', update);
      else mql.removeListener(update);
    };
  }, []);

  const maxIndex = Math.max(0, tiles.length - cardsPerView);
  // On mobile we hand scrolling to native scroll-snap (smoother), so the JS
  // pointer-drag handlers are disabled there to avoid fighting native scroll.
  const isMobile = cardsPerView === 1;
  const dragEnabled = !isMobile && maxIndex > 0;

  // Clamp current index if viewport change reduces the available range.
  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [maxIndex, index]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  /* ---------- Pointer-drag carousel ---------- */
  const trackRef = useRef(null);
  const cardStepRef = useRef(0);
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    startIndex: 0,
    totalDx: 0,
    didDrag: false,
  });

  const measureStep = () => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width;
    const computed = window.getComputedStyle(track);
    const gap = parseFloat(computed.columnGap || computed.gap) || 24;
    cardStepRef.current = cardWidth + gap;
  };

  useEffect(() => {
    measureStep();
    window.addEventListener('resize', measureStep);
    return () => window.removeEventListener('resize', measureStep);
  }, [cardsPerView]);

  const setDragOffset = (px) => {
    const track = trackRef.current;
    if (track) track.style.setProperty('--drag', `${px}px`);
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('a, button')) return;
    const track = trackRef.current;
    if (!track) return;
    measureStep();
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
      startIndex: index,
      totalDx: 0,
      didDrag: false,
      captured: false,
    };
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.startX;
    d.totalDx = dx;
    if (!d.didDrag && Math.abs(dx) > 5) {
      d.didDrag = true;
      setIsDragging(true);
      const track = trackRef.current;
      if (track && !d.captured) {
        try { track.setPointerCapture(e.pointerId); d.captured = true; } catch {}
      }
    }
    if (!d.didDrag) return;

    const now = performance.now();
    const instDx = e.clientX - d.lastX;
    const dt = now - d.lastTime;
    if (dt > 0) d.velocity = instDx / dt;
    d.lastX = e.clientX;
    d.lastTime = now;

    let visualDx = dx;
    const step = cardStepRef.current;
    if (step > 0) {
      const projected = d.startIndex - dx / step;
      if (projected < 0) {
        const overshootPx = -projected * step;
        visualDx = dx - overshootPx + overshootPx * 0.3;
      } else if (projected > maxIndex) {
        const overshootPx = (projected - maxIndex) * step;
        visualDx = dx + overshootPx - overshootPx * 0.3;
      }
    }
    setDragOffset(visualDx);
  };

  const endDrag = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    if (e && e.pointerId !== undefined && e.pointerId !== d.pointerId) return;
    d.active = false;
    const track = trackRef.current;
    if (track && e && e.pointerId !== undefined) {
      try { track.releasePointerCapture(e.pointerId); } catch {}
    }
    setIsDragging(false);

    const step = cardStepRef.current || 1;
    const projectionPx = d.velocity * 220;
    const targetPx = d.totalDx + projectionPx;
    const deltaIndex = -Math.round(targetPx / step);
    const newIndex = Math.max(0, Math.min(maxIndex, d.startIndex + deltaIndex));
    setIndex(newIndex);
    setDragOffset(0);
  };

  const onClickCapture = (e) => {
    if (dragRef.current.didDrag) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.didDrag = false;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <section className="pf-section" id="portfolio">
        <div className="pf-content">
          <div className="pf-inner">
            {/* ── Benefits smart card (dark) ── */}
            <div className="bf-frame">
              <h2 className="gal-title bf-title">We don't ask for your trust. We earn it.</h2>

              {/* ── Review overview strip ── */}
              <div className="ro-strip">
                <div className="ro-score">
                  <div className="ro-score-top">
                    <span className="ro-score-num">{RATING.score}</span>
                    <Stars className="ro-stars" />
                  </div>
                  <span className="ro-score-count">Based on {RATING.count} Google reviews</span>
                </div>

                <span className="ro-sep" aria-hidden="true" />

                <div className="ro-bars">
                  {RATING_DIST.map(({ stars, pct }) => (
                    <div className="ro-bar-row" key={stars}>
                      <span className="ro-bar-label">{stars}</span>
                      <svg className="ro-bar-star" viewBox="0 0 24 24" aria-hidden="true"><path d={STAR_PATH} /></svg>
                      <span className="ro-bar-track"><span className="ro-bar-fill" style={{ width: `${pct}%` }} /></span>
                    </div>
                  ))}
                </div>

                <span className="ro-sep" aria-hidden="true" />

                <div className="ro-badge">
                  <GoogleLogo />
                  <div className="ro-badge-text">
                    <span className="ro-badge-title">Google Reviews</span>
                    <span className="ro-badge-sub">Verified business</span>
                  </div>
                </div>
              </div>

              <div className="bf-carousel">
                <div className="bf-track">
                  {[...REVIEWS, ...REVIEWS].map((r, i) => (
                    <article className="rv-card" key={i} aria-hidden={i >= REVIEWS.length ? 'true' : undefined}>
                      <div className="rv-head">
                        <img className="rv-avatar" src={r.avatar || avatarUrl(r.name)} alt="" loading="lazy" draggable="false" />
                        <div className="rv-meta">
                          <span className="rv-name">{r.name}</span>
                          <Stars />
                        </div>
                        <GoogleLogo />
                      </div>
                      <p className="rv-text">{r.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Recent-work carousel (ported from serviceroot Products) ── */}
            <div className="pc-head">
              <h2 className="pc-heading">Homes we've cared for</h2>
              <div className="pc-controls" role="group" aria-label="Slideshow navigation">
                <button
                  type="button"
                  className="pc-arrow"
                  onClick={prev}
                  disabled={index === 0}
                  aria-label="Previous"
                >
                  <PolygonLeft />
                </button>
                <button
                  type="button"
                  className="pc-arrow"
                  onClick={next}
                  disabled={index >= maxIndex}
                  aria-label="Next"
                >
                  <PolygonRight />
                </button>
              </div>
            </div>

            {/* TODO: replace placeholders with real Premium Chimneys job photos */}
            <div
              ref={trackRef}
              className={`pc-track ${isDragging ? 'pc-track-dragging' : ''}`}
              style={{ '--index': index }}
              role="region"
              aria-label="Recent work"
              onPointerDown={dragEnabled ? onPointerDown : undefined}
              onPointerMove={dragEnabled ? onPointerMove : undefined}
              onPointerUp={dragEnabled ? endDrag : undefined}
              onPointerCancel={dragEnabled ? endDrag : undefined}
              onLostPointerCapture={dragEnabled ? endDrag : undefined}
              onClickCapture={dragEnabled ? onClickCapture : undefined}
            >
              {galleryTiles.map((t, i) => (
                <div className="pc-card" key={i}>
                  <div className="pc-tile">
                    <img
                      className="pc-img"
                      src={t.src}
                      alt={t.label}
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA banner ── */}
          <FinalCTA landing={landing} />
        </div>
      </section>
    </>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap');

  .pf-section {
    position: relative;
    overflow: hidden;
    background: transparent;
    font-family: 'Inter Tight', sans-serif;

    /* Each card is exactly (visible-container - gap) / 2 on desktop, so two
       cards fit inside the container and the rest spill into the gutter. */
    --card-width: calc((min(100vw, 1200px) - 48px - 24px) / 2);
    --card-gap: 24px;
  }
  .pf-content { position: relative; z-index: 1; }

  .pf-inner { position: relative; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .gal-title {
    margin: 0;
    font-size: 48px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #1a1225;
  }

  /* ── Reviews smart card (light) ── */
  .bf-frame {
    position: relative;
    overflow: hidden;
    margin: 0 0 96px;
    border-radius: 24px;
    padding: 52px 40px 36px;
    background: #ffffff;
    border: 1px solid rgba(124, 58, 237, 0.10);
    box-shadow: 0 6px 28px rgba(26, 18, 37, 0.05);
  }
  .bf-title {
    text-align: center;
    margin: 0 0 32px;
  }

  /* ── Review overview strip ── */
  .ro-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
    max-width: 720px;
    margin: 0 auto 12px;
    padding: 22px 32px;
    border-radius: 16px;
    background: #f7f5fc;
    border: 1px solid rgba(124, 58, 237, 0.10);
  }
  .ro-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;
  }
  .ro-score-top { display: flex; align-items: center; gap: 12px; }
  .ro-score-num {
    font-size: 42px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    color: #1a1225;
  }
  .ro-stars { display: inline-flex; gap: 3px; }
  .ro-stars svg { width: 18px; height: 18px; fill: #fbbf24; display: block; filter: drop-shadow(0 1px 3px rgba(251, 191, 36, 0.3)); }
  .ro-score-count {
    font-size: 12.5px;
    font-weight: 500;
    color: #6b5b86;
    letter-spacing: 0.01em;
  }
  .ro-sep {
    align-self: stretch;
    width: 1px;
    background: linear-gradient(180deg, transparent, rgba(26, 18, 37, 0.12), transparent);
  }
  .ro-bars {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
    min-width: 190px;
    max-width: 260px;
  }
  .ro-bar-row { display: flex; align-items: center; gap: 8px; }
  .ro-bar-label {
    font-size: 11px;
    font-weight: 600;
    color: #6b5b86;
    font-variant-numeric: tabular-nums;
  }
  .ro-bar-star { width: 11px; height: 11px; fill: #fbbf24; flex-shrink: 0; }
  .ro-bar-track {
    position: relative;
    flex: 1;
    height: 5px;
    border-radius: 100px;
    background: rgba(26, 18, 37, 0.08);
    overflow: hidden;
  }
  .ro-bar-fill {
    position: absolute;
    inset: 0 auto 0 0;
    height: 100%;
    border-radius: 100px;
    background: linear-gradient(90deg, #d97706, #fbbf24);
  }
  .ro-badge { display: flex; align-items: center; gap: 11px; flex-shrink: 0; }
  .ro-badge .rv-google { width: 26px; height: 26px; }
  .ro-badge-text { display: flex; flex-direction: column; gap: 1px; }
  .ro-badge-title { font-size: 13px; font-weight: 700; color: #1a1225; letter-spacing: -0.01em; }
  .ro-badge-sub { font-size: 11px; font-weight: 500; color: #6b5b86; }
  .bf-carousel {
    overflow: hidden;
    padding: 30px 0;
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%);
  }
  .bf-track {
    display: flex;
    width: max-content;
    animation: bf-marquee 80s linear infinite;
  }
  @keyframes bf-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ── Review cards (Google reviews, light) ── */
  .rv-card {
    flex: 0 0 360px;
    width: 360px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 24px;
    border-radius: 16px;
    background: #f7f5fc;
    border: 1px solid rgba(124, 58, 237, 0.10);
    box-sizing: border-box;
  }
  .rv-head { display: flex; align-items: center; gap: 12px; }
  .rv-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid rgba(124, 58, 237, 0.15);
  }
  .rv-meta { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1; }
  .rv-name { font-size: 15px; font-weight: 700; color: #1a1225; letter-spacing: -0.01em; }
  .rv-stars { display: inline-flex; gap: 2px; }
  .rv-stars svg { width: 14px; height: 14px; fill: #fbbf24; display: block; }
  .rv-google { width: 20px; height: 20px; flex-shrink: 0; align-self: flex-start; }
  .rv-text {
    font-size: 14px;
    line-height: 1.55;
    color: #4a4a55;
    margin: 0;
    /* Clamp every review to the same 6 lines so all cards share one height;
       longer reviews get a trailing ellipsis. */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    line-clamp: 6;
    overflow: hidden;
    height: calc(1.55em * 6);
  }

  /* ── Recent-work carousel (ported from serviceroot Products) ── */
  .pc-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 44px;
    flex-wrap: wrap;
  }
  .pc-heading {
    font-size: clamp(36px, 5.2vw, 64px);
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1.05;
    color: #1a1225;
    margin: 0;
  }
  .pc-controls {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 6px;
  }
  .pc-arrow {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(15, 15, 20, 0.04);
    border: 1px solid rgba(15, 15, 20, 0.10);
    color: #0f0f14;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    padding: 0;
    transition: background 200ms ease,
                border-color 200ms ease,
                color 200ms ease,
                transform 180ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  .pc-arrow:hover {
    background: rgba(15, 15, 20, 0.08);
    border-color: rgba(15, 15, 20, 0.16);
  }
  .pc-arrow:disabled {
    opacity: 0.28;
    cursor: not-allowed;
    pointer-events: none;
  }
  .pc-track {
    display: flex;
    gap: var(--card-gap);
    transform: translate3d(
      calc(-1 * (var(--card-width) + var(--card-gap)) * var(--index, 0) + var(--drag, 0px)),
      0, 0
    );
    transition: transform 620ms cubic-bezier(0.32, 0.72, 0, 1);
    will-change: transform;
    user-select: none;
    touch-action: pan-y;
  }
  .pc-track img {
    -webkit-user-drag: none;
    user-select: none;
  }
  .pc-track-dragging {
    transition: none;
  }
  .pc-card {
    width: var(--card-width);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
  }
  .pc-tile {
    position: relative;
    aspect-ratio: 1 / 1;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(26, 18, 37, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
  .pc-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 960px) {
    .pf-inner { padding: 24px 20px; }
    .gal-title { font-size: 36px; }
    /* Reviews smart card: match the other cards' 24px padding; h2 left-aligned */
    .bf-frame { margin-bottom: 24px; padding: 24px; }
    .bf-title { margin-bottom: 24px; text-align: left; }
    .ro-strip { padding: 20px; gap: 20px; }
    .pc-head { margin-bottom: 24px; }
  }
  @media (max-width: 720px) {
    /* Mobile: ~60%-width photos in a native, fluid scroll-snap strip.
       JS reads this same breakpoint via matchMedia and disables pointer-drag. */
    .pf-section { --card-width: 60vw; --card-gap: 16px; }
    /* Photos only — hide the prev/next arrows on mobile. */
    .pc-controls { display: none; }
    /* Hand scrolling to the browser for smooth momentum + snapping. */
    .pc-track {
      transform: none !important;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      scroll-padding: 0 20px;
      touch-action: pan-x pan-y;
      scrollbar-width: none;
      /* Bleed past the container's left/right padding so photos overflow to both screen edges. */
      margin-left: -20px;
      margin-right: -20px;
    }
    .pc-track::-webkit-scrollbar { display: none; }
    .pc-card { scroll-snap-align: center; }
  }
  @media (max-width: 560px) {
    .pc-head { margin-bottom: 24px; }
    .pc-tile { border-radius: 20px; }
    .pc-arrow { width: 36px; height: 36px; }
    /* Reviews smart card → stack the overview cleanly, fit cards to phone width */
    .bf-frame { padding: 24px 16px; }
    .ro-strip { flex-direction: column; align-items: stretch; gap: 16px; padding: 18px; }
    .ro-sep { display: none; }
    .ro-score { align-items: flex-start; }
    .ro-score-num { font-size: 36px; }
    .ro-bars { min-width: 0; max-width: none; }
    .rv-card { flex: 0 0 280px; width: 280px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .bf-track { animation: none; }
    .pc-track { transition-duration: 0ms !important; }
  }
`;
