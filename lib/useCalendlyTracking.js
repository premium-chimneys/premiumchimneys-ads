'use client'

import { useEffect } from 'react'

const EXPIRY_MS = 90 * 24 * 60 * 60 * 1000
const KEYS = {
  gclid: 'pc_gclid',
  msclkid: 'pc_msclkid',
  utm: 'pc_utm',
}

function setWithExpiry(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({ value, expiresAt: Date.now() + EXPIRY_MS })
    )
  } catch {}
}

export function useTrackingCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)

    const gclid = params.get('gclid')
    const msclkid = params.get('msclkid')
    if (gclid) setWithExpiry(KEYS.gclid, gclid)
    if (msclkid) setWithExpiry(KEYS.msclkid, msclkid)

    const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    const utm = {}
    let hasUtm = false
    for (const f of fields) {
      const v = params.get(f)
      if (v) {
        utm[f] = v
        hasUtm = true
      }
    }
    if (hasUtm) setWithExpiry(KEYS.utm, utm)
  }, [])
}
