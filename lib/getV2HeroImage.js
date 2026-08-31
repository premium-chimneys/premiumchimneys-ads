import { supabase } from './supabase'

// V2-only hero image selection. The image is a function of (service group,
// metroplex):
//   - chimney_core services  -> image varies per metroplex
//   - fireplace services      -> one shared image (metroplex-independent)
//   - anything else           -> null (caller falls back to the V1 image)
//
// Grouping is kept here as a code constant on purpose: the two lists are fixed
// and this is V2-specific logic, so it stays out of the shared `services` table.
// V1 never calls this — it keeps using services.hero_image_url untouched.
const CHIMNEY_CORE = new Set([
  'chimney-sweep',
  'chimney-inspection',
  'chimney-repair',
  'chimney-caps',
])

const FIREPLACE = new Set([
  'fireplace-inspection',
  'fireplace-cleaning',
  'fireplace-repair',
  'fireplace-maintenance',
  'gas-fireplace-repair',
])

function serviceGroup(slug) {
  if (CHIMNEY_CORE.has(slug)) return 'chimney_core'
  if (FIREPLACE.has(slug)) return 'fireplace'
  return null
}

// Returns the V2 hero image URL, or null when there's no mapping (unknown
// service, or the table has no row yet) — so the caller can fall back to the
// existing services.hero_image_url and nothing breaks before the table is
// populated.
export async function getV2HeroImage(serviceSlug, metroplex) {
  const group = serviceGroup(serviceSlug)
  if (!group) return null

  let query = supabase
    .from('v2_hero_images')
    .select('image_url')
    .eq('service_group', group)

  if (group === 'chimney_core') {
    if (!metroplex) return null
    query = query.eq('metroplex', metroplex)
  } else {
    // fireplace — single row, not tied to a metroplex
    query = query.is('metroplex', null)
  }

  const { data, error } = await query.maybeSingle()
  if (error || !data) return null
  return data.image_url || null
}
