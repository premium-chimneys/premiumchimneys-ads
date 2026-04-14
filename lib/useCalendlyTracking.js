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

function getWithExpiry(key) {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.expiresAt !== 'number') return null
    if (Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(key)
      return null
    }
    return parsed.value
  } catch {
    return null
  }
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

export function getCalendlyUrl(baseUrl) {
  if (typeof window === 'undefined') return baseUrl

  const gclid = getWithExpiry(KEYS.gclid)
  const msclkid = getWithExpiry(KEYS.msclkid)
  const utm = getWithExpiry(KEYS.utm) || {}

  const source = utm.utm_source || (gclid ? 'google' : msclkid ? 'bing' : null)
  const medium = utm.utm_medium || (gclid || msclkid ? 'cpc' : null)
  const campaign = utm.utm_campaign || null
  const content = msclkid || utm.utm_content || null
  const term = gclid || utm.utm_term || null

  try {
    const out = new URL(baseUrl)
    if (source) out.searchParams.set('utm_source', source)
    if (medium) out.searchParams.set('utm_medium', medium)
    if (campaign) out.searchParams.set('utm_campaign', campaign)
    if (content) out.searchParams.set('utm_content', content)
    if (term) out.searchParams.set('utm_term', term)
    return out.toString()
  } catch {
    return baseUrl
  }
}
