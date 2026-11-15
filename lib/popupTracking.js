'use client'

// Records what visitors do with the timed popup, for the /popup stats page.
//
// Events (one row each, all tied to a random id kept for the browser tab):
//   shown      the popup opened
//   claim      they tapped the popup's button
//   dismiss    they closed it (×, backdrop or Escape)
//   converted  after seeing the popup, they booked, sent a form, tapped a phone
//              number or left their details in the chat. Logged once per tab.
//
// A visitor who saw the popup and did neither claim nor dismiss is counted as
// having left; that needs no event of its own.

const SID_KEY = 'pc-popup-sid'
const SHOWN_KEY = 'pc-popup-shown'
const CONVERTED_KEY = 'pc-popup-converted'
const ENDPOINT = '/api/popup-event'
const GATEWAY_ORIGIN = 'https://gateway.serviceroot.io'

function storageGet(key) {
  try { return window.sessionStorage.getItem(key) } catch { return null }
}
function storageSet(key, value) {
  try { window.sessionStorage.setItem(key, value) } catch { /* blocked storage */ }
}

function sessionId() {
  let id = storageGet(SID_KEY)
  if (!id) {
    id = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`)
    storageSet(SID_KEY, id)
  }
  return id
}

function send(payload) {
  try {
    const body = JSON.stringify({ sid: sessionId(), ...payload })
    // sendBeacon survives the page being closed or navigated away from.
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: 'application/json' }))) return
    fetch(ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {})
  } catch {
    // Stats must never break the page.
  }
}

export function logPopupEvent(event, { service, variant } = {}) {
  if (event === 'shown') storageSet(SHOWN_KEY, '1')
  send({ event, service, variant, path: window.location.pathname })
}

function logConversion(kind) {
  // Only visitors who have seen the popup in this tab, and only once.
  if (!storageGet(SHOWN_KEY) || storageGet(CONVERTED_KEY)) return
  storageSet(CONVERTED_KEY, kind)
  send({ event: 'converted', kind, path: window.location.pathname })
}

// Listens for conversions on this page. Returns a cleanup function.
export function watchConversions() {
  const onClick = (ev) => {
    if (ev.target?.closest?.('a[href^="tel:"]')) logConversion('call')
  }
  // The site's own forms are posted by capture.js on their native submit.
  const onSubmit = (ev) => {
    if (ev.target?.matches?.('form')) logConversion('form')
  }
  // The booking popup (booking.js) tells the page when a booking is made.
  const onMessage = (ev) => {
    if (ev.origin === GATEWAY_ORIGIN && ev.data?.type === 'gateway-booking-complete') logConversion('booking')
  }
  document.addEventListener('click', onClick, true)
  document.addEventListener('submit', onSubmit, true)
  window.addEventListener('message', onMessage)

  // The chat widget posts the visitor's name and phone to this path when they
  // ask for an agent. It exposes no event, so watch the network request.
  let observer
  try {
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('/api/chat-agent/lead')) logConversion('chat')
      }
    })
    observer.observe({ type: 'resource', buffered: false })
  } catch {
    // Older browsers: chat conversions go uncounted.
  }

  return () => {
    document.removeEventListener('click', onClick, true)
    document.removeEventListener('submit', onSubmit, true)
    window.removeEventListener('message', onMessage)
    observer?.disconnect()
  }
}
