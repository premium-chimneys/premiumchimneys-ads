'use client'

import { useEffect } from 'react'
import { useTrackingCapture } from '@/lib/useCalendlyTracking'

export default function TrackingCapture() {
  useTrackingCapture()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = (e) => {
      // Only accept messages from Calendly's origin
      const ok = e.origin === 'https://calendly.com' || e.origin.endsWith('.calendly.com')
      if (!ok) return

      // Only the booking-complete event — ignore profile_page_viewed,
      // event_type_viewed, date_and_time_selected, etc.
      if (
        e.data &&
        typeof e.data === 'object' &&
        e.data.event === 'calendly.event_scheduled'
      ) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'calendly_booking_completed')
        }
        window.dataLayer?.push({ event: 'calendly_booking_completed' })
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return null
}
