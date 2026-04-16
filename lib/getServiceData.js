import { supabase } from './supabase'

export async function getServiceData(slug) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single()

  console.log('[getServiceData] slug:', slug, '| data:', data, '| error:', error)

  if (error) return null
  return data
}
