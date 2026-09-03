import { supabase } from './supabase'

// The carousel slides ride along on the services row rather than costing their
// own query. service_gallery has a foreign key to services.id, so PostgREST
// returns them nested — and with ~9,000 landing paths each revalidating hourly,
// a second round trip here would be paid nine thousand times an hour to fetch
// at most six rows.
const COLUMNS =
  '*, service_gallery(sort_order, image_url, image_url_small, scope, title, result, alt)'

export async function getServiceData(slug, brand = 'Premium Chimneys') {
  let { data, error } = await supabase
    .from('services')
    .select(COLUMNS)
    .eq('brand', brand)
    .eq('slug', slug)
    .maybeSingle()

  // Until sql/service_gallery.sql has been applied, PostgREST cannot resolve
  // the embed and rejects the whole request. Retry without it so the page keeps
  // rendering exactly as it did before, on the built-in gallery. Once the
  // migration is in, this branch is dead and can come out.
  if (error && /service_gallery/i.test(error.message || '')) {
    ;({ data, error } = await supabase
      .from('services')
      .select('*')
      .eq('brand', brand)
      .eq('slug', slug)
      .maybeSingle())
  }

  if (error) throw error
  return data
}
