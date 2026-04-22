import { supabase } from './supabase'

export async function getCityData(slug) {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('brand', 'Premium Chimneys')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}
