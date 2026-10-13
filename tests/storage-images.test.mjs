import { test } from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import nextConfig from '../next.config.mjs'
import { isStorageImage, STORAGE_HOST, STORAGE_PUBLIC_PATH } from '../lib/storage-image-config.mjs'
import { sourceFiles, jsxElements } from './source-scan.mjs'

// `next` has no exports map, so plain Node needs the file name that the
// bundler resolves on its own. NODE_ENV=test skips next/image's dev-only
// remotePatterns check, which has no injected config outside a Next build.
registerHooks({ resolve: (specifier, context, next) => next(specifier === 'next/image' ? 'next/image.js' : specifier, context) })
process.env.NODE_ENV = 'test'
const { storageImgProps } = await import('../lib/storage-image.mjs')

// Reviewed exceptions. Each must stay off Supabase.
const UNOPTIMIZED_OK = new Set([
  'app/chimney-cleaning/[city]/page.js', // HERO_IMAGE is a Webflow CDN literal in ./content.js
])
const STORAGE_LITERAL_OK = new Set([
  'lib/serviceGallery.js', // gallery fallback data, rendered through storageImgProps
])

const STORAGE = `https://${STORAGE_HOST}${STORAGE_PUBLIC_PATH}landing-v2/gallery/a-920.webp`

test('next/image is allowed to optimize Supabase Storage and caches the result for weeks', () => {
  const { images } = nextConfig
  assert.ok(images.remotePatterns.some((p) => p.hostname === STORAGE_HOST && p.pathname === `${STORAGE_PUBLIC_PATH}**` && p.protocol === 'https'))
  assert.ok(images.minimumCacheTTL >= 30 * 24 * 3600, 'optimized images must stay in the edge cache for at least 30 days')
  assert.ok(Array.isArray(images.qualities) && images.qualities.length > 0)
  assert.notEqual(images.unoptimized, true)
})

test('isStorageImage recognises only public objects in this project', () => {
  assert.equal(isStorageImage(STORAGE), true)
  assert.equal(isStorageImage(STORAGE.replace('https:', 'http:')), false)
  assert.equal(isStorageImage(`https://${STORAGE_HOST}/storage/v1/object/sign/landing-v2/a.webp`), false)
  assert.equal(isStorageImage('https://cdn.prod.website-files.com/x.webp'), false)
  assert.equal(isStorageImage('/images/a.webp'), false)
  assert.equal(isStorageImage(undefined), false)
})

test('a Storage image is only ever served through the optimizer', () => {
  const props = storageImgProps(STORAGE, '100vw')
  assert.match(props.src, /^\/_next\/image\?url=/)
  for (const candidate of props.srcSet.split(', ')) assert.match(candidate, /^\/_next\/image\?url=\S+ \d+w$/)
  assert.equal(props.sizes, '100vw')
  assert.deepEqual(storageImgProps('https://cdn.prod.website-files.com/x.webp', '100vw'), { src: 'https://cdn.prod.website-files.com/x.webp' })
})

// The regressions this guards: an <img> whose src is computed (a database URL
// such as hero_image_url or service_gallery.image_url) skipping the helper, a
// next/image marked unoptimized, or a Storage URL written into a component.
test('no Supabase Storage image bypasses lib/storage-image.mjs', () => {
  const offenders = []
  for (const { path, text } of sourceFiles('app', 'components')) {
    for (const { source, line } of jsxElements(text, 'img')) {
      // Its src must come from a spread of storageImgProps(...), directly or
      // through a const assigned from it in the same file.
      const spreads = [...source.matchAll(/\{\s*\.\.\.\s*([A-Za-z_$][\w$]*)(\()?/g)]
      const viaHelper = spreads.some(([, name, call]) => (call ? name === 'storageImgProps' : new RegExp(`\\bconst\\s+${name}\\s*=\\s*storageImgProps\\(`).test(text)))
      if (/\bsrc=\{/.test(source) || (spreads.length && !viaHelper)) offenders.push(`${path}:${line} <img> with a computed src must spread storageImgProps()`)
      if (/\bsrcSet=/.test(source)) offenders.push(`${path}:${line} <img> builds its own srcSet; use storageImgProps()`)
    }
    for (const { source, line } of jsxElements(text, 'Image')) {
      // Allowed only where src is a literal URL that is not on Supabase.
      if (/\bunoptimized\b/.test(source) && !UNOPTIMIZED_OK.has(`${path}`)) offenders.push(`${path}:${line} unoptimized next/image`)
    }
  }
  for (const { path, text } of sourceFiles('app', 'components', 'lib')) {
    if (text.includes(`${STORAGE_HOST}/storage/`) && !STORAGE_LITERAL_OK.has(path)) offenders.push(`${path}: Storage URL outside the gallery data module`)
  }
  assert.deepEqual(offenders, [])
})
