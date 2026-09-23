import { landingDb, readLandingContent } from './landingContent'

// Fetches the landing_v2 row for a given service slug (V2 landing page only).
// Uses public, cached reads. An outage uses the bundled row; an absent row
// returns null so the V2 page can use its built-in content.
export async function getLandingV2Data(slug) {
  const query = landingDb
    .from('landing_v2')
    .select('*')
    .eq('service', slug)
  return readLandingContent(query, 'landing_v2', (row) => row.service === slug)
}
