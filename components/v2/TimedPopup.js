'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTimedPopup } from '@/lib/useTimedPopup'
import { TIMED_POPUP_COPY } from '@/lib/timedPopupCopy'
import { logPopupEvent, watchConversions } from '@/lib/popupTracking'

// Popup shown 30s after landing. When and whether it opens lives in
// lib/useTimedPopup.js. V2 copy of components/TimedPopup.js; edit freely
// without touching V1.
//
// The card is centred on every screen; from 768px up it is a little larger.
//
// Once mounted it stays mounted and closing only hides it. The CTA is a
// booking button, and if booking.js has not loaded yet BookingLoader replays
// the click on that same element later. An element removed from the page
// would never deliver that replayed click.

const VARIANT = 'v2'

const CSS = `
.tp-root{position:fixed;inset:0;z-index:2147483000;visibility:hidden;pointer-events:none;
  font-family:'Inter Tight',-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased}
.tp-root.tp-open{visibility:visible;pointer-events:auto}
.tp-backdrop{position:absolute;inset:0;background:rgba(3,5,12,.8);opacity:0;transition:opacity .25s ease}
.tp-open .tp-backdrop{opacity:1}
.tp-card{position:absolute;left:50%;outline:none;top:50%;
  width:calc(100% - 48px);max-width:420px;background:#fff;border-radius:33px;overflow:hidden;
  transform:translate(-50%,-46%);opacity:0;transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .25s ease}
.tp-open .tp-card{transform:translate(-50%,-50%);opacity:1}
.tp-media{position:relative;display:block;width:100%;aspect-ratio:1/1;max-height:calc(100dvh - 310px);background:#efe6dd}
.tp-media img{object-fit:cover;object-position:center 70%}
.tp-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:50%;border:0;padding:0;
  display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;
  background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.tp-close svg{width:14px;height:14px}
.tp-body{padding:22.5px 32px 28px}
.tp-title{margin:0;font-size:23.6px;line-height:1.15;font-weight:800;letter-spacing:-.015em;color:#0c0f14}
.tp-text{margin:9px 0 0;font-size:12px;line-height:14px;font-weight:400;color:#0c0f14}
.tp-cta{display:flex;align-items:center;justify-content:center;width:100%;height:42px;margin-top:27.3px;
  border:1px solid #7c3aed;border-radius:12px;color:#f0e0fd;font:inherit;font-size:12.5px;font-weight:700;
  letter-spacing:.01em;cursor:pointer;position:relative;overflow:hidden;text-shadow:0 1px 2px rgba(45,15,80,.35);
  background:linear-gradient(160deg,#9b5de5 0%,#7c3aed 25%,#5b21b6 50%,#6d28d9 72%,#8b5cf6 100%);
  box-shadow:inset 0 1px 0 rgba(196,155,240,.55),inset 0 -1px 0 rgba(0,0,0,.22),0 2px 10px rgba(91,33,182,.45);
  transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
.tp-cta::before{content:"";position:absolute;top:0;left:-70%;width:40%;height:100%;pointer-events:none;
  background:linear-gradient(105deg,transparent 35%,rgba(210,175,255,.38) 50%,transparent 65%);
  transform:skewX(-12deg);transition:left .55s ease}
.tp-cta:active{transform:translateY(0);box-shadow:inset 0 1px 0 rgba(196,155,240,.4),inset 0 -1px 0 rgba(0,0,0,.22),0 2px 6px rgba(91,33,182,.3)}
.tp-close:focus-visible,.tp-cta:focus-visible{outline:2px solid #7c3aed;outline-offset:2px}
@media (min-width:768px){
  .tp-card{width:440px;max-width:calc(100% - 48px);transform:translate(-50%,-48%) scale(.98)}
  .tp-open .tp-card{transform:translate(-50%,-50%)}
  .tp-media{max-height:calc(100dvh - 360px)}
  .tp-close{top:14px;right:14px;width:36px;height:36px}
  .tp-close svg{width:15px;height:15px}
  .tp-close:hover{background:rgba(0,0,0,.6)}
  .tp-body{padding:30px 36px 32px}
  .tp-title{font-size:26px}
  .tp-text{margin-top:12px;font-size:15px;line-height:1.35}
  .tp-cta{height:48px;margin-top:28px;font-size:15px}
  .tp-cta:hover{transform:translateY(-1px);border-color:#8b5cf6;box-shadow:inset 0 1px 0 rgba(196,155,240,.55),inset 0 -1px 0 rgba(0,0,0,.22),0 5px 18px rgba(91,33,182,.5)}
  .tp-cta:hover::before{left:130%}
}
@media (prefers-reduced-motion:reduce){.tp-backdrop,.tp-card{transition:none}}
`

export default function TimedPopup({ service }) {
  const copy = TIMED_POPUP_COPY[service]
  const { open, primed, close } = useTimedPopup(Boolean(copy))
  const cardRef = useRef(null)

  // Conversions are watched on every page, so one made on a later page in the
  // same tab still counts. Only tabs that saw the popup are recorded.
  useEffect(() => watchConversions(), [])

  useEffect(() => {
    if (open) logPopupEvent('shown', { service, variant: VARIANT })
  }, [open, service])

  const dismiss = useCallback(() => {
    logPopupEvent('dismiss', { service, variant: VARIANT })
    close('dismiss')
  }, [close, service])

  const claim = () => {
    logPopupEvent('claim', { service, variant: VARIANT })
    close('claim')
  }

  useEffect(() => {
    if (!open) return
    cardRef.current?.focus({ preventScroll: true })
    const onKey = (ev) => { if (ev.key === 'Escape') dismiss() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, dismiss])

  if (!copy || (!primed && !open)) return null

  return (
    <div className={`tp-root${open ? ' tp-open' : ''}`} aria-hidden={!open}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="tp-backdrop" onClick={dismiss} />
      <div ref={cardRef} tabIndex={-1} className="tp-card" role="dialog" aria-modal="true" aria-labelledby="tp-title">
        <div className="tp-media">
          <Image
            src="/images/timed-popup.webp"
            alt=""
            fill
            loading="eager"
            sizes="(min-width: 768px) 440px, calc(100vw - 48px)"
          />
          <button type="button" className="tp-close" onClick={dismiss} aria-label="Close">
            <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="tp-body">
          <h2 id="tp-title" className="tp-title">{copy.heading}</h2>
          <p className="tp-text">{copy.text}</p>
          <button type="button" className="tp-cta" data-gateway-book="" data-gateway-note={copy.note} onClick={claim}>
            {copy.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
