import { supabase } from './supabase'

// A city, or null when there is no such city.
//
// This used `.single()`, which treats "no rows" as an error and throws it. Every
// caller is a page keyed on a URL segment, so any two-segment URL that is not a
// real city — a bot probing /.well-known/traffic-advice, a WordPress scanner, a
// mistyped /chimney-sweepp/dallas-tx, an ad crawler on /chimney-sweep/v2 —
// crashed the render and came back 500 instead of 404.
//
// `.maybeSingle()` returns null for no rows and still errors on a genuine
// database problem, which is the distinction the callers need: null means the
// page does not exist and they call notFound(); a thrown error still means
// something is actually wrong and should still be a 500.
//
// Matches getServiceData, which has always worked this way.
export async function getCityData(slug) {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('brand', 'Premium Chimneys')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data
}
