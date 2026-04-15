'use client';
import { useEffect, useState, useRef } from 'react';

export default function WhatsIncluded({ city, service, content }) {
  const [layerIdx, setLayerIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const layers = content?.layers || [];

  useEffect(() => {
    if (!layers.length) return;
    const t = setTimeout(() => {
      if (pausedRef.current) return;
      const maxItem = layers[layerIdx].items.length - 1;
      if (itemIdx < maxItem) {
        setItemIdx(itemIdx + 1);
      } else {
        setLayerIdx((layerIdx + 1) % layers.length);
        setItemIdx(0);
      }
    }, 3800);
    return () => clearTimeout(t);
  }, [layerIdx, itemIdx, layers]);

  if (!layers.length) return null;
  const activeLayer = layers[layerIdx];
  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  const selectLayer = i => { pause(); setLayerIdx(i); setItemIdx(0); };
  const selectItem = i => { pause(); setItemIdx(i); };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="wi">
        <div className="wi-bg-grid" aria-hidden="true" />
        <div className="wi-container">
          <div className="wi-header">
            <div className="wi-eyebrow">
              <span className="wi-eyebrow-dot" />
              What&apos;s Included
            </div>
            <h2 className="wi-title">{content.title}</h2>
            {content.intro && (
              <p className="wi-lede">
                {typeof content.intro === 'function' ? content.intro({ city }) : content.intro}
              </p>
            )}
          </div>

          <div className="wi-tabs" role="tablist" aria-label="Service layers">
            {layers.map((l, i) => {
              const on = i === layerIdx;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  className={`wi-tab ${on ? 'wi-tab-on' : ''}`}
                  onClick={() => selectLayer(i)}
                >
                  <span className="wi-tab-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="wi-tab-text">
                    <span className="wi-tab-label">{l.label}</span>
                    <span className="wi-tab-tag">{l.tagline}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="wi-stage">
            <aside className="wi-aside">
              <div className="wi-depth" aria-hidden="true">
                {layers.map((_, i) => (
                  <span
                    key={i}
                    className={`wi-depth-bar ${i < layerIdx ? 'wi-depth-done' : ''} ${i === layerIdx ? 'wi-depth-current' : ''}`}
                  />
                ))}
              </div>
              <div className="wi-aside-num">{String(layerIdx + 1).padStart(2, '0')}</div>
              <div className="wi-aside-label">{activeLayer.label}</div>
              <div className="wi-aside-tag">{activeLayer.tagline}</div>
              <div className="wi-aside-counter">
                <span className="wi-aside-counter-now">{String(itemIdx + 1).padStart(2, '0')}</span>
                <span className="wi-aside-counter-sep">/</span>
                <span className="wi-aside-counter-total">{String(activeLayer.items.length).padStart(2, '0')}</span>
              </div>
            </aside>

            <div className="wi-items" key={activeLayer.id} onMouseLeave={resume}>
              {activeLayer.items.map((it, i) => {
                const on = i === itemIdx;
                return (
                  <button
                    type="button"
                    key={`${activeLayer.id}-${i}`}
                    className={`wi-item ${on ? 'wi-item-on' : ''}`}
                    onMouseEnter={() => selectItem(i)}
                    onFocus={() => selectItem(i)}
                    onClick={() => selectItem(i)}
                    style={{ animationDelay: `${i * 70}ms` }}
                    aria-expanded={on}
                  >
                    <div className="wi-item-head">
                      <span className="wi-item-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="wi-item-title">{it.title}</span>
                      {it.highlight && <span className="wi-item-pill">{it.highlight}</span>}
                      <svg className="wi-item-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                    <div className="wi-item-body">
                      <div className="wi-item-body-inner">
                        <p className="wi-item-detail">{it.detail}</p>
                        {it.meta && <div className="wi-item-meta">{it.meta}</div>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const css = `
  .wi {
    position: relative;
    background: #07040d;
    padding: 120px 24px;
    overflow: hidden;
    font-family: 'Inter Tight', sans-serif;
  }
  .wi-bg-grid {
    position: absolute; inset: 0;
    background-image:
      radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.18), transparent 70%),
      linear-gradient(rgba(167,139,250,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(167,139,250,0.04) 1px, transparent 1px);
    background-size: auto, 48px 48px, 48px 48px;
    pointer-events: none;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 40%, transparent 100%);
  }
  .wi-container { position: relative; max-width: 1200px; margin: 0 auto; }

  .wi-header { max-width: 720px; margin: 0 auto 56px; text-align: center; }
  .wi-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
    color: #c4b5fd;
    padding: 8px 14px;
    border: 1px solid rgba(167,139,250,0.25);
    background: rgba(124,58,237,0.08);
    border-radius: 100px;
    margin-bottom: 20px;
  }
  .wi-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 100px; background: #c084fc;
    box-shadow: 0 0 12px #c084fc;
    animation: wi-pulse 2s ease-in-out infinite;
  }
  .wi-title {
    font-size: 48px; font-weight: 700; line-height: 1.08;
    letter-spacing: -0.03em; color: #fff; margin: 0 0 18px;
  }
  .wi-lede { font-size: 16px; line-height: 1.65; color: rgba(255,255,255,0.55); margin: 0; }

  /* Tabs */
  .wi-tabs {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    margin: 0 auto 40px; max-width: 880px;
  }
  .wi-tab {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px; border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    font-family: inherit; cursor: pointer; text-align: left;
    transition: all 0.3s ease;
    color: rgba(255,255,255,0.55);
  }
  .wi-tab:hover {
    color: rgba(255,255,255,0.9);
    border-color: rgba(167,139,250,0.25);
    background: rgba(255,255,255,0.04);
  }
  .wi-tab-on {
    color: #fff;
    background: linear-gradient(160deg, rgba(155,93,229,0.18), rgba(91,33,182,0.08));
    border-color: rgba(167,139,250,0.5);
    box-shadow: 0 6px 28px rgba(91,33,182,0.28), inset 0 1px 0 rgba(196,155,240,0.2);
  }
  .wi-tab-num {
    font-size: 22px; font-weight: 700; letter-spacing: -0.02em;
    background: linear-gradient(135deg, #a78bfa, #e879f9);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    min-width: 28px;
  }
  .wi-tab-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .wi-tab-label { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
  .wi-tab-tag {
    font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(196,181,253,0.65);
  }

  /* Stage */
  .wi-stage {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 40px;
    align-items: stretch;
  }

  /* Aside depth panel */
  .wi-aside {
    position: relative;
    padding: 36px 32px;
    border-radius: 20px;
    border: 1px solid rgba(167,139,250,0.15);
    background:
      linear-gradient(180deg, rgba(124,58,237,0.12), rgba(10,5,20,0) 70%),
      rgba(255,255,255,0.02);
    display: flex; flex-direction: column;
  }
  .wi-depth {
    display: flex; gap: 6px; margin-bottom: 28px;
  }
  .wi-depth-bar {
    flex: 1; height: 4px; border-radius: 100px;
    background: rgba(255,255,255,0.08);
    transition: background 0.5s ease, box-shadow 0.5s ease;
  }
  .wi-depth-done { background: rgba(167,139,250,0.55); }
  .wi-depth-current {
    background: linear-gradient(90deg, #a78bfa, #e879f9);
    box-shadow: 0 0 14px rgba(192,132,252,0.6);
  }
  .wi-aside-num {
    font-size: 72px; font-weight: 700; line-height: 0.9;
    letter-spacing: -0.05em;
    background: linear-gradient(135deg, #a78bfa, #c084fc, #e879f9);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
  }
  .wi-aside-label {
    font-size: 20px; font-weight: 700; color: #fff;
    letter-spacing: -0.015em; margin-bottom: 6px;
  }
  .wi-aside-tag {
    font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(196,181,253,0.75);
  }
  .wi-aside-counter {
    margin-top: auto; padding-top: 28px;
    display: flex; align-items: baseline; gap: 4px;
    font-variant-numeric: tabular-nums;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .wi-aside-counter-now {
    font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.02em;
  }
  .wi-aside-counter-sep { font-size: 18px; color: rgba(255,255,255,0.3); }
  .wi-aside-counter-total { font-size: 14px; color: rgba(255,255,255,0.45); }

  /* Items */
  .wi-items { display: flex; flex-direction: column; gap: 12px; }
  .wi-item {
    display: block; width: 100%; text-align: left;
    padding: 22px 26px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.025);
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.35s ease, background 0.35s ease, transform 0.35s ease;
    animation: wi-slide 0.5s cubic-bezier(.2,.7,.2,1) both;
  }
  .wi-item:hover {
    border-color: rgba(167,139,250,0.3);
    background: rgba(255,255,255,0.04);
  }
  .wi-item-on {
    border-color: rgba(167,139,250,0.55);
    background: linear-gradient(160deg, rgba(124,58,237,0.14), rgba(10,5,20,0.3));
    box-shadow: 0 8px 32px rgba(91,33,182,0.25), inset 0 1px 0 rgba(196,155,240,0.15);
  }
  @keyframes wi-slide {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .wi-item-head {
    display: flex; align-items: center; gap: 16px;
  }
  .wi-item-num {
    font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
    color: rgba(196,181,253,0.8);
    padding: 4px 8px; border-radius: 6px;
    background: rgba(167,139,250,0.1);
    border: 1px solid rgba(167,139,250,0.22);
    font-variant-numeric: tabular-nums;
    transition: all 0.35s ease;
  }
  .wi-item-on .wi-item-num {
    color: #fff;
    background: linear-gradient(135deg, rgba(167,139,250,0.35), rgba(232,121,249,0.3));
    border-color: rgba(192,132,252,0.6);
    box-shadow: 0 0 12px rgba(192,132,252,0.4);
  }
  .wi-item-title {
    flex: 1; font-size: 16px; font-weight: 600;
    color: rgba(255,255,255,0.85);
    letter-spacing: -0.01em;
    transition: color 0.3s ease;
  }
  .wi-item-on .wi-item-title { color: #fff; }
  .wi-item-pill {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: #f0abfc;
    padding: 4px 9px;
    border: 1px solid rgba(232,121,249,0.4);
    background: rgba(232,121,249,0.1);
    border-radius: 100px;
  }
  .wi-item-chev {
    color: rgba(255,255,255,0.4);
    transition: transform 0.35s ease, color 0.3s ease;
  }
  .wi-item-on .wi-item-chev {
    transform: rotate(180deg);
    color: #c4b5fd;
  }

  .wi-item-body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s cubic-bezier(.2,.7,.2,1);
  }
  .wi-item-on .wi-item-body { grid-template-rows: 1fr; }
  .wi-item-body-inner {
    overflow: hidden;
    min-height: 0;
  }
  .wi-item-detail {
    margin: 14px 0 0;
    padding-left: 46px;
    font-size: 14px; line-height: 1.7;
    color: rgba(255,255,255,0.65);
  }
  .wi-item-meta {
    margin: 12px 0 0;
    padding-left: 46px;
    font-size: 12px; color: rgba(196,181,253,0.7);
    letter-spacing: 0.04em;
  }

  @keyframes wi-pulse {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.4; }
  }

  @media (max-width: 960px) {
    .wi-tabs { grid-template-columns: 1fr; max-width: 560px; }
    .wi-stage { grid-template-columns: 1fr; gap: 24px; }
    .wi-aside { padding: 28px; }
    .wi-aside-num { font-size: 56px; }
    .wi-aside-counter { padding-top: 20px; }
  }
  @media (max-width: 640px) {
    .wi { padding: 80px 20px; }
    .wi-title { font-size: 34px; }
    .wi-item { padding: 18px 20px; }
    .wi-item-head { gap: 12px; }
    .wi-item-title { font-size: 15px; }
    .wi-item-detail, .wi-item-meta { padding-left: 0; }
  }
`;
