import { popupDb } from '@/lib/popupDb'

// Receives one popup event from lib/popupTracking.js (sendBeacon) and stores
// it. Always answers 204: the page never waits on or reacts to this.
const EVENTS = new Set(['shown', 'claim', 'dismiss', 'converted'])
const str = (v, max) => (typeof v === 'string' && v ? v.slice(0, max) : null)

export async function POST(request) {
  try {
    const body = await request.json()
    if (EVENTS.has(body?.event) && str(body.sid, 64)) {
      const { error } = await popupDb.rpc('log_popup_event', {
        p_sid: str(body.sid, 64),
        p_event: body.event,
        p_kind: str(body.kind, 20),
        p_service: str(body.service, 60),
        p_variant: str(body.variant, 10),
        p_path: str(body.path, 200),
      })
      if (error) console.error('[popup-event] insert failed', error.message)
    }
  } catch (error) {
    console.error('[popup-event] bad request', error?.message)
  }
  return new Response(null, { status: 204 })
}
