import { supabase } from './supabase'

export async function getCityData(slug) {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}
