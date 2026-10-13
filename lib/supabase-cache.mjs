// The one road from a page to Supabase.
//
// The Supabase project is shared and on the free plan: every PostgREST request
// is egress and a log line against its quota. So page reads never reach it per
// visitor. supabase-js is handed this fetch, which puts every read in the Next
// Data Cache: one request per distinct query per hour, whichever page or ISR
// pass asks, and the stale copy is served while it refreshes.
//
// Only GET/HEAD are cached; anything else goes straight through, so a write
// added later can never be answered from cache.
//
// tests/supabase-cache.test.mjs fails if a Supabase client is created anywhere
// else, or if this stops caching.

export const SUPABASE_REVALIDATE_SECONDS = 3600
export const SUPABASE_CACHE_TAG = 'landing-content'

export function cachedSupabaseFetch(input, init = {}) {
  const method = String(init.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()
  if (method !== 'GET' && method !== 'HEAD') return fetch(input, init)
  return fetch(input, {
    ...init,
    cache: 'force-cache',
    next: { revalidate: SUPABASE_REVALIDATE_SECONDS, tags: [SUPABASE_CACHE_TAG] },
  })
}

// Pass supabase-js's createClient in, so this file has no dependencies and
// the tests can load it directly.
export function createCachedClient(createClient, url, key) {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: cachedSupabaseFetch },
  })
}
