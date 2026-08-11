'use client'

import { useEffect } from 'react'

// Lifts the animation hold described in globals.css, then keeps offscreen
// sections parked.
//
// The document is served with [data-anim-hold] on <body>, so the ~100 infinite
// loops in the below-the-fold sections cost nothing while the page is loading
// — which is exactly the window the hero image spends waiting to be painted.
// Once load has fired and the main thread is quiet the hold comes off and the
// design runs as authored.
//
// After that, an observer parks any section that is out of view. Because this
// only ever runs post-release, a section is frozen mid-cycle rather than on its
// first frame, so nothing shows a stopped gradient as it scrolls in. The 300px
// margin means a section resumes before it is actually visible.
//
// section.hero is deliberately never observed: the form's post-submit success
// animations live in there, and they must never be parked while a visitor is
// looking at them.
export default function AnimationGate() {
  useEffect(() => {
    const body = document.body
    let observer
    let idleId

    const release = () => {
      body.removeAttribute('data-anim-hold')

      if (!('IntersectionObserver' in window)) return

      const targets = [...document.querySelectorAll('section, footer')].filter(
        (el) => !el.classList.contains('hero') && !el.closest('.hero')
      )
      if (!targets.length) return

      observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) e.target.removeAttribute('data-anim-idle')
            else e.target.setAttribute('data-anim-idle', '')
          }
        },
        { rootMargin: '300px' }
      )
      targets.forEach((el) => observer.observe(el))
    }

    const whenIdle = () => {
      idleId = window.requestIdleCallback
        ? window.requestIdleCallback(release, { timeout: 2000 })
        : setTimeout(release, 800)
    }

    if (document.readyState === 'complete') whenIdle()
    else window.addEventListener('load', whenIdle, { once: true })

    return () => {
      window.removeEventListener('load', whenIdle)
      if (idleId) (window.cancelIdleCallback || clearTimeout)(idleId)
      observer?.disconnect()
      // Never leave the page permanently frozen if this unmounts.
      body.removeAttribute('data-anim-hold')
      document
        .querySelectorAll('[data-anim-idle]')
        .forEach((el) => el.removeAttribute('data-anim-idle'))
    }
  }, [])

  return null
}
