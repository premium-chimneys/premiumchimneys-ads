import { createClient } from '@supabase/supabase-js'
import { createCachedClient } from './supabase-cache.mjs'

// Public landing-page reads only. Never use this cached client for customer data.
// Every read goes through the Next Data Cache (lib/supabase-cache.mjs).
export const landingDb = createCachedClient(
  createClient,
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

export const LANDING_READ_TIMEOUT_MS = 5000
const LANDING_READ_ATTEMPTS = 2

// A successful empty read remains empty: removed content must still return 404.
//
// There is no bundled copy to fall back on: it went stale and served old
// addresses after edits in Supabase. A read that still fails after a retry
// throws, so the ISR pass fails and Next keeps serving the last page that was
// built from live data (and retries on the next request).
export async function readLandingContent(query, table) {
  let lastError
  for (let attempt = 1; attempt <= LANDING_READ_ATTEMPTS; attempt++) {
    try {
      const { data, error } = await query.abortSignal(AbortSignal.timeout(LANDING_READ_TIMEOUT_MS)).maybeSingle()
      if (error) throw error
      return data
    } catch (error) {
      lastError = error
      console.error('[landing-content] read failed', {
        table, attempt, reason: error?.message || 'request failed',
      })
    }
  }
  throw lastError
}
