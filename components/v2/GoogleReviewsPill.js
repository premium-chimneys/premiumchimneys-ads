'use client'

import { useRef } from 'react'

// The live Elfsight Google Reviews widget id (same one that used to render
// inline in the hero). We keep it mounted but invisible + interactive right
// under our custom face, then forward a click to it so Elfsight opens its own
// native "all reviews" popup — Elfsight exposes no public API to open it.
const ELF_CLASS = 'elfsight-app-78d5d8f1-b6c0-487e-bc47-52b7a1546592'

const css = `
.grp {
  position: relative;
  display: inline-flex;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.grp:focus-visible {
  outline: 2px solid #7c3aed;
  outline-offset: 3px;
  border-radius: 12px;
}

/* Real widget: present + clickable so its popup can fire, but invisible and
   sitting exactly beneath the custom face. */
.grp-elf {
  position: absolute;
  inset: 0;
  opacity: 0;
  overflow: hidden;
  z-index: 0;
}
.grp-elf > div { width: 100%; height: 100%; }

/* Custom face — matches the hero location pill. */
.grp-face {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter Tight', sans-serif;
  background: #ffffff;
  border: 1px solid rgba(124, 58, 237, 0.22);
  border-radius: 12px;
  padding: 10px 18px 10px 10px;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.grp-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(124, 58, 237, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 2px 6px rgba(17, 20, 26, 0.06);
}
.grp-logo svg { width: 22px; height: 22px; display: block; }
.grp-divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(to bottom, transparent, rgba(124, 58, 237, 0.20), transparent);
}
.grp-text { display: flex; flex-direction: column; gap: 3px; }
.grp-eyebrow {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.15;
  color: #11141a;
}
.grp-count {
  font-style: italic;
  font-weight: 400;
}
.grp-stars { display: inline-flex; align-items: center; gap: 2px; }
.grp-stars svg { width: 15px; height: 15px; display: block; }
`

function Star() {
  return (
    <svg viewBox="0 0 24 24" fill="#fbbc04" aria-hidden="true">
      <path d="M12 2l2.9 6.26L21.8 9.27l-4.9 4.78L18.18 21 12 17.27 5.82 21l1.28-6.95L2.2 9.27l6.9-1.01L12 2z" />
    </svg>
  )
}

const GoogleG = (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
)

export default function GoogleReviewsPill() {
  const elfRef = useRef(null)
  const faceRef = useRef(null)

  function openPopup() {
    const elf = elfRef.current
    const face = faceRef.current
    if (!elf || typeof document === 'undefined') return
    const rect = elf.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // Momentarily let clicks fall through the face so elementFromPoint returns
    // the Elfsight node beneath, then forward a click to open its popup.
    const prevPE = face ? face.style.pointerEvents : ''
    if (face) face.style.pointerEvents = 'none'
    let target = document.elementFromPoint(cx, cy)
    if (face) face.style.pointerEvents = prevPE
    // If the center didn't land inside the widget, fall back to its first
    // interactive descendant.
    if (!target || !elf.contains(target)) {
      target = elf.querySelector('a[href], button, [role="button"]') || target
    }
    if (!target || !elf.contains(target)) return
    // Prefer an enclosing interactive element, then dispatch a bubbling click
    // so it reaches Elfsight's (often delegated) handler. Use dispatchEvent
    // rather than .click() — the hit node may be an SVG element with no click().
    const trigger = (target.closest && target.closest('a[href], button, [role="button"]')) || target
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
  }

  return (
    <div
      className="grp"
      role="button"
      tabIndex={0}
      aria-label="Read our Google reviews"
      onClick={openPopup}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openPopup()
        }
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grp-elf" ref={elfRef} aria-hidden="true">
        <div className={ELF_CLASS} data-elfsight-app-lazy={true}></div>
      </div>
      <div className="grp-face" ref={faceRef}>
        <span className="grp-logo">{GoogleG}</span>
        <span className="grp-divider" aria-hidden="true"></span>
        <span className="grp-text">
          <span className="grp-eyebrow">4.9 rated <span className="grp-count">(21,330 reviews)</span></span>
          <span className="grp-stars">
            <Star /><Star /><Star /><Star /><Star />
          </span>
        </span>
      </div>
    </div>
  )
}
