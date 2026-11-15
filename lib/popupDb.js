import { createClient } from '@supabase/supabase-js'
import { createCachedClient } from './supabase-cache.mjs'

// Supabase client for the popup stats (sql/popup_events.sql). Built through
// the cache wrapper like every other client, but both calls it makes are RPCs,
// which supabase-js sends as POST, and the wrapper never caches a POST. So
// events always reach the table and the /popup page always shows fresh counts.
export const popupDb = createCachedClient(
  createClient,
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)
