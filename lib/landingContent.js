import { createClient } from '@supabase/supabase-js'
import snapshot from '@/data/landing-content.json'
import { createCachedClient } from './supabase-cache.mjs'

// Public landing-page reads only. Never use this cached client for customer data.
// Every read goes through the Next Data Cache (lib/supabase-cache.mjs).
export const landingDb = createCachedClient(
  createClient,
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

export const LANDING_READ_TIMEOUT_MS = 1500

// A successful empty read remains empty: removed content must still return 404.
// On failure, use the public snapshot shipped with this deployment. This also
// works for cold URLs/server instances, unlike an in-memory last-good cache.
export async function readLandingContent(query, table, matches) {
  try {
    const { data, error } = await query.abortSignal(AbortSignal.timeout(LANDING_READ_TIMEOUT_MS)).maybeSingle()
    if (error) throw error
    return data
  } catch (error) {
    const fallback = snapshot[table].find(matches) || null
    console.warn('[landing-content] using bundled content', {
      table, snapshotAt: snapshot.generatedAt, found: Boolean(fallback),
      reason: error?.message || 'request failed',
    })
    return fallback
  }
}
