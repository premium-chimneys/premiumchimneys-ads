'use client'

import { useEffect } from 'react'

const SRC = 'https://elfsightcdn.com/platform.js'

// platform.js is ~526 KB transferred. Loading it with next/script's
// afterInteractive meant it started downloading during the initial render and
// competed with the hero for bandwidth on every page, on every variant.
//
// Nothing here needs to exist before the user can see or touch a widget, so
// hold it until either:
//   - a widget comes within 400px of the viewport, or
//   - the user actually points at one.
//
// The V2 hero pill (GoogleReviewsPill) is a wrinkle: it sits above the fold
// with a real, invisible widget layered over it to catch clicks, so it is
// "in view" immediately. Waiting for load + idle first keeps it off the
// critical path anyway, and the pointer listener means a visitor who goes
// straight for it still gets the popup.
export default function ElfsightLoader() {
  useEffect(() => {
    if (document.querySelector(`script[src="${SRC}"]`)) return

    let done = false
    const load = () => {
      if (done) return
      done = true
      cleanup()
      const s = document.createElement('script')
      s.src = SRC
      s.async = true
      document.body.appendChild(s)
    }

    const widgets = () => document.querySelectorAll('[class*="elfsight-app-"]')

    // A real pointer on a widget beats any heuristic — load immediately.
    // Capture phase so it fires even though the pill layers elements on top.
    const onPointer = (e) => {
      if (e.target.closest?.('[class*="elfsight-app-"]')) load()
    }
    document.addEventListener('pointerdown', onPointer, { capture: true })
    document.addEventListener('pointerover', onPointer, { capture: true })

    let observer
    let idleId
    const cleanup = () => {
      document.removeEventListener('pointerdown', onPointer, { capture: true })
      document.removeEventListener('pointerover', onPointer, { capture: true })
      observer?.disconnect()
      if (idleId) (window.cancelIdleCallback || clearTimeout)(idleId)
    }

    // Only start watching once the page has finished loading and gone quiet,
    // so the observer can never fire while the hero is still coming in.
    const startObserving = () => {
      // Deliberately skip the V2 hero pill (.grp-elf). It is above the fold, so
      // observing it would pull 526 KB on every single visit and defeat the
      // whole point — a session that bounces from the hero should never pay for
      // it. The pointer listeners above still cover it, so someone who reaches
      // for the pill gets the widget.
      const found = [...widgets()].filter((el) => !el.closest('.grp-elf'))
      if (!found.length) return
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) load()
        },
        { rootMargin: '400px' }
      )
      found.forEach((el) => observer.observe(el))
    }

    const whenIdle = () => {
      idleId = window.requestIdleCallback
        ? window.requestIdleCallback(startObserving, { timeout: 3000 })
        : setTimeout(startObserving, 1500)
    }

    if (document.readyState === 'complete') whenIdle()
    else window.addEventListener('load', whenIdle, { once: true })

    return cleanup
  }, [])

  return null
}
