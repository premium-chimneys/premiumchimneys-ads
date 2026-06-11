import { supabase } from './supabase'

// Fetches the landing_v2 row for a given service slug (V2 landing page only).
// Uses the public anon client; the table has public-read RLS. Returns null when
// there's no row or on error, so the V2 page falls back to its built-in content.
export async function getLandingV2Data(slug) {
  const { data, error } = await supabase
    .from('landing_v2')
    .select('*')
    .eq('service', slug)
    .maybeSingle()

  if (error) {
    console.error('getLandingV2Data error:', error.message)
    return null
  }
  return data
}
