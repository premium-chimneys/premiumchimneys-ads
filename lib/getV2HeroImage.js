import { supabase } from './supabase'

// V2-only hero image selection. The image is a function of (service group,
// city):
//   - chimney_core services  -> a skyline, only on the cities in HERO_KEY
//   - fireplace services      -> one shared image (city-independent)
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

// City slug -> the v2_hero_images.metroplex key whose chimney_core image it
// shows. The images are city skylines, and suburb visitors read a big-city
// skyline as "not a local company" and bounce (Naperville seeing Chicago), so
// only the cities listed here get one; everywhere else falls back to the V1
// image. The key is just a label for the picture, not cities.metroplex: Fort
// Worth is in the `dfw` metroplex but has its own `fort-worth` image.
// To give a city its own skyline: upload the image, add a v2_hero_images row
// under a new key, and add the city here.
const HERO_KEY = {
  'chicago-il': 'chicago',
  'dallas-tx': 'dfw',
  'fort-worth-tx': 'fort-worth',
  'austin-tx': 'austin',
  'seattle-wa': 'seattle',
  'san-antonio-tx': 'san-antonio',
}

function serviceGroup(slug) {
  if (CHIMNEY_CORE.has(slug)) return 'chimney_core'
  if (FIREPLACE.has(slug)) return 'fireplace'
  return null
}

// Returns the V2 hero image URL, or null when there's no mapping (unknown
// service, a city not in HERO_KEY, or the table has no row yet) — so the caller
// can fall back to the existing services.hero_image_url and nothing breaks
// before the table is populated.
export async function getV2HeroImage(serviceSlug, citySlug) {
  const group = serviceGroup(serviceSlug)
  if (!group) return null

  let query = supabase
    .from('v2_hero_images')
    .select('image_url')
    .eq('service_group', group)

  if (group === 'chimney_core') {
    const key = HERO_KEY[citySlug]
    if (!key) return null
    query = query.eq('metroplex', key)
  } else {
    // fireplace — single row, not tied to a city
    query = query.is('metroplex', null)
  }

  const { data, error } = await query.maybeSingle()
  if (error || !data) return null
  return data.image_url || null
}
