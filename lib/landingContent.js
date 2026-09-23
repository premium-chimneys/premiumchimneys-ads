import { createClient } from '@supabase/supabase-js'
import snapshot from '@/data/landing-content.json'

// Public landing-page reads only. Never use this cached client for customer data.
export const landingDb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (url, options) => fetch(url, {
        ...options,
        cache: 'force-cache',
        next: { revalidate: 3600, tags: ['landing-content'] },
      }),
    },
  },
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
