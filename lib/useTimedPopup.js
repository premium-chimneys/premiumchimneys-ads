'use client'

import { useCallback, useEffect, useState } from 'react'

// When the timed popup opens, and when it must never open.
//
// It opens DELAY_MS after the page loads, unless by then the visitor has
// already engaged: started filling in a form, tapped a phone number, tapped a
// booking button, or used the chat widget. Someone who has done any of those
// is already converting, and a popup on top of the form they are typing into, or the booking modal
// they just opened, would only get in their way.
//
// Engagement and dismissal both last for the browser session (sessionStorage),
// so a visitor who called, booked, filled a form or closed the popup is not
// shown it again on the next service page they open. A fresh session starts
// over.

const DELAY_MS = 30_000
// Mount the (still hidden) popup this long before it opens, so its image is
// already downloaded when it appears instead of popping in.
const PRIME_MS = DELAY_MS - 5_000
const STORAGE_KEY = 'pc-timed-popup'

// Booking buttons. V2 marks every one with data-gateway-book (what booking.js
// listens for). Three V1 buttons carry no such marker, so they are matched by
// class: the hero, footer and "What's included" book buttons.
const BOOK_SELECTOR = [
  '[data-gateway-book]',
  '.hero-cta-primary',
  '.footer-btn-book',
  '.wi-cta-btn',
].join(',')
const CALL_SELECTOR = 'a[href^="tel:"]'
// The chat widget (chat.js, served from agents.premiumchimneys.com). Any tap or
// focus on its launcher button, its panel or its "ask" box counts.
const CHAT_SELECTOR = '#sr-chat-launcher, #sr-chat-panel, .sr-ask'
const FORM_FIELD_SELECTOR = 'form input, form textarea, form select'

function readFlag() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeFlag(value) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Private mode or blocked storage: the in-memory check still holds for
    // this page; only the carry-over to the next page is lost.
  }
}

export function useTimedPopup(enabled = true) {
  const [open, setOpen] = useState(false)
  const [primed, setPrimed] = useState(false)

  useEffect(() => {
    // No popup for this page, or already engaged/dismissed this session.
    if (!enabled || readFlag()) return

    let engaged = false
    let timer
    let primeTimer

    const engage = () => {
      if (engaged) return
      engaged = true
      clearTimeout(timer)
      clearTimeout(primeTimer)
      writeFlag('engaged')
      detach()
    }

    // Capture phase so these see the event before anything else on the page
    // can stop it (BookingLoader, booking.js, the chat widget).
    const onClick = (ev) => {
      const t = ev.target
      if (t?.closest?.(`${BOOK_SELECTOR},${CALL_SELECTOR},${CHAT_SELECTOR}`)) engage()
    }
    // Focusing a field counts as starting to fill the form in — including a
    // tap on mobile, which focuses before any key is pressed.
    const onFocus = (ev) => {
      const t = ev.target
      if (t?.matches?.(FORM_FIELD_SELECTOR) || t?.closest?.(CHAT_SELECTOR)) engage()
    }
    // Browser autofill can populate fields without focusing them.
    const onInput = (ev) => {
      if (ev.target?.closest?.(`form,${CHAT_SELECTOR}`)) engage()
    }

    function detach() {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('focusin', onFocus, true)
      document.removeEventListener('input', onInput, true)
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('focusin', onFocus, true)
    document.addEventListener('input', onInput, true)

    primeTimer = setTimeout(() => setPrimed(true), PRIME_MS)
    timer = setTimeout(() => {
      detach()
      if (!engaged && !readFlag()) setOpen(true)
    }, DELAY_MS)

    return () => {
      clearTimeout(timer)
      clearTimeout(primeTimer)
      detach()
    }
  }, [enabled])

  // reason: 'dismiss' (×, backdrop, Escape) or 'claim' (the popup's button).
  const close = useCallback((reason = 'dismiss') => {
    setOpen(false)
    writeFlag(reason === 'claim' ? 'claimed' : 'dismissed')
  }, [])

  return { open, primed, close }
}
