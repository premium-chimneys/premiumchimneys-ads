import { supabase } from './supabase'

export async function getServiceData(slug, brand = 'Premium Chimneys') {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('brand', brand)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data
}
