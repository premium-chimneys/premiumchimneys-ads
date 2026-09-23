import { landingDb, readLandingContent } from './landingContent'

// The carousel slides ride along on the services row rather than costing their
// own query. service_gallery has a foreign key to services.id, so PostgREST
// returns them nested — and with ~9,000 landing paths each revalidating hourly,
// a second round trip here would be paid nine thousand times an hour to fetch
// at most six rows.
const COLUMNS =
  '*, service_gallery(sort_order, image_url, image_url_small, scope, title, result, alt)'

export async function getServiceData(slug, brand = 'Premium Chimneys') {
  const query = landingDb
    .from('services')
    .select(COLUMNS)
    .eq('brand', brand)
    .eq('slug', slug)
  return readLandingContent(query, 'services', (row) => row.brand === brand && row.slug === slug)
}
