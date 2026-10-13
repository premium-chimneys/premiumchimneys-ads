// The one definition of "a Supabase Storage image" for this site, and the
// next/image settings that serve every one of them.
//
// Why images do not load straight from Supabase: the shared Supabase project is
// on the free plan, its public Storage objects answer `Cache-Control: no-cache`,
// and every request is both egress and a log line against the project quota.
// Linked directly, every visitor and every crawler re-downloaded the full-size
// file from Supabase. Routed through the Next.js image optimizer instead, each
// file is fetched from Supabase once per width per cache period, resized to the
// slot it fills, and then served from Vercel's edge cache.
//
// Plain .mjs with no imports so next.config.mjs and the node tests can load it.

export const STORAGE_HOST = 'labekmkkpbgrxfpcsyvz.supabase.co'
export const STORAGE_PUBLIC_PATH = '/storage/v1/object/public/'

// 31 days. The optimizer keeps an image for max(this, upstream max-age), and
// Supabase sends no-cache, so this is the effective edge lifetime. Redeploys do
// not clear it: replace an image by uploading it under a new name rather than
// overwriting the object (or purge it in Vercel), or the old one is served
// until the TTL runs out. The gallery and hero files are named for their
// content and size already.
export const IMAGE_CACHE_TTL_SECONDS = 2678400

export function isStorageImage(src) {
  if (typeof src !== 'string') return false
  try {
    const url = new URL(src)
    return url.protocol === 'https:' && url.hostname === STORAGE_HOST && url.pathname.startsWith(STORAGE_PUBLIC_PATH)
  } catch {
    return false
  }
}

// Each width x quality is a separate optimizer transformation (billed on Vercel
// Pro), so the lists are kept short. The heroes are 1724px sources and the
// gallery photos 920px; nothing here needs more than 1920.
export const imagesConfig = {
  remotePatterns: [{ protocol: 'https', hostname: STORAGE_HOST, pathname: `${STORAGE_PUBLIC_PATH}**` }],
  minimumCacheTTL: IMAGE_CACHE_TTL_SECONDS,
  qualities: [75],
  formats: ['image/webp'],
  deviceSizes: [640, 828, 1080, 1920],
  imageSizes: [384],
  // The Storage URLs are final; a redirect would mean someone pointed a row at
  // something that is not a public object.
  maximumRedirects: 0,
}
