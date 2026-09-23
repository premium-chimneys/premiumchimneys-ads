import { landingDb, readLandingContent } from './landingContent'

// A city, or null when there is no such city.
//
// This used `.single()`, which treats "no rows" as an error and throws it. Every
// caller is a page keyed on a URL segment, so any two-segment URL that is not a
// real city — a bot probing /.well-known/traffic-advice, a WordPress scanner, a
// mistyped /chimney-sweepp/dallas-tx, an ad crawler on /chimney-sweep/v2 —
// crashed the render and came back 500 instead of 404.
//
// `.maybeSingle()` returns null for no rows. Database errors use the bundled
// public content instead, so an outage cannot break an existing city page.
//
// Matches getServiceData, which has always worked this way.
export async function getCityData(slug) {
  const query = landingDb
    .from('cities')
    .select('*')
    .eq('brand', 'Premium Chimneys')
    .eq('slug', slug)
  return readLandingContent(query, 'cities', (row) => row.brand === 'Premium Chimneys' && row.slug === slug)
}
