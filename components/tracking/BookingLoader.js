'use client'

import { useEffect } from 'react'

const SRC = 'https://gateway.serviceroot.io/booking.js'
const TENANT = 'premium-chimneys'
const MODE = 'popup'
const TRIGGER = '[data-gateway-book]'

// Where a visitor goes if booking.js cannot be fetched at all. This is the
// same hosted flow the popup renders in its iframe, just as a full page.
const FALLBACK_BASE = `https://gateway.serviceroot.io/book/${TENANT}`

// The popup forwards this page's full URL to the booking flow as ?parent_url=,
// and the booking page reports that as the lead's source_url — which is where
// every utm_* and the gclid are read from downstream. A bare navigation to
// FALLBACK_BASE carries none of that, so a visitor who arrives on an ad click
// and then hits this fallback books as if they walked in off the street. Send
// the same parameter by hand so the fallback attributes exactly like the popup.
function fallbackUrl() {
  try {
    return `${FALLBACK_BASE}?parent_url=${encodeURIComponent(window.location.href)}`
  } catch {
    return FALLBACK_BASE
  }
}

// booking.js is not a passive widget: its very last statement installs the
// delegated click listener that makes every [data-gateway-book] element work
// (gateway/public/booking.js, `document.addEventListener('click', ..., true)`).
// The V2 booking buttons are bare `<button type="button">` with no href and no
// onClick, so until that listener exists a click on the hero CTA does nothing
// at all — silently. That rules out a plain `strategy="lazyOnload"`, which
// would leave the primary CTA dead for the whole idle window.
//
// So: load it on idle like lazyOnload would, but bring it forward the moment a
// visitor shows intent, and hold any click that still lands too early until the
// script is ready. booking.js exposes no API to open the modal directly, so an
// early click is honoured by replaying it as a synthetic click once the real
// listener is installed.
let loadPromise = null
let loaded = false

function loadBooking() {
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    // Never insert a second copy: booking.js has no re-entry guard, so a
    // duplicate would install a second click listener and double-report every
    // click to the funnel endpoint.
    const existing = document.querySelector(`script[src="${SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('booking.js failed')), { once: true })
      return
    }

    const s = document.createElement('script')
    s.src = SRC
    s.async = true
    // booking.js resolves its tenant and mode from its own <script> tag and
    // returns immediately if there is no data-tenant, so these have to ride
    // along on the injected element.
    s.setAttribute('data-tenant', TENANT)
    s.setAttribute('data-mode', MODE)
    s.addEventListener('load', () => resolve(), { once: true })
    s.addEventListener('error', () => {
      // Drop the dead tag and clear the promise so a later click can retry
      // rather than waiting on a script that will never load.
      s.remove()
      loadPromise = null
      reject(new Error('booking.js failed'))
    }, { once: true })
    document.body.appendChild(s)
  })

  loadPromise.then(
    () => { loaded = true },
    () => {}
  )

  return loadPromise
}

export default function BookingLoader() {
  useEffect(() => {
    let cancelled = false
    let idleId
    let replaying = false

    const start = () => loadBooking().catch(() => {})

    // Intent: a pointer over a booking button, a keyboard focus, or a touch
    // start. Capture phase and `pointerover` rather than `pointerenter` so it
    // still fires for the svg and text nodes inside the button.
    const onIntent = (ev) => {
      if (loaded) return
      if (ev.target.closest?.(TRIGGER)) start()
    }

    const onClick = (ev) => {
      // Once booking.js is in, it owns every booking click. Our listener was
      // registered first, so it runs first — step aside cleanly.
      if (loaded || replaying) return

      const trigger = ev.target.closest?.(TRIGGER)
      if (!trigger) return

      // Hold the click. Match booking.js and only preventDefault — leaving
      // propagation alone so nothing else on the page loses the event.
      ev.preventDefault()

      // A held click must always end in something happening. If the script
      // neither loads nor errors within a few seconds — a stalled connection,
      // or a `load` event we can never receive because the tag was already in
      // the DOM and finished before we attached — send the visitor to the
      // hosted flow rather than leaving the button dead.
      const settled = Promise.race([
        loadBooking(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('booking.js timed out')), 4000)),
      ])

      settled.then(
        () => {
          if (cancelled) return
          // booking.js has no public open(), so hand it the click it missed.
          // Its listener is capture-phase on document, which a synthetic
          // bubbling click still reaches.
          replaying = true
          try {
            trigger.dispatchEvent(
              new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
            )
          } finally {
            replaying = false
          }
        },
        () => {
          if (cancelled) return
          window.location.href = fallbackUrl()
        }
      )
    }

    document.addEventListener('pointerover', onIntent, { capture: true })
    document.addEventListener('touchstart', onIntent, { capture: true, passive: true })
    document.addEventListener('focusin', onIntent, { capture: true })
    document.addEventListener('click', onClick, true)

    // Baseline: the lazyOnload-equivalent path. Everything above is only there
    // to cover the visitor who reaches the CTA before this fires.
    const whenIdle = () => {
      idleId = window.requestIdleCallback
        ? window.requestIdleCallback(start, { timeout: 3000 })
        : setTimeout(start, 1500)
    }
    if (document.readyState === 'complete') whenIdle()
    else window.addEventListener('load', whenIdle, { once: true })

    return () => {
      cancelled = true
      document.removeEventListener('pointerover', onIntent, { capture: true })
      document.removeEventListener('touchstart', onIntent, { capture: true })
      document.removeEventListener('focusin', onIntent, { capture: true })
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('load', whenIdle)
      if (idleId) (window.cancelIdleCallback || clearTimeout)(idleId)
    }
  }, [])

  return null
}
