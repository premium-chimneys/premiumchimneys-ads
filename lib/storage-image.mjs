import { getImageProps } from 'next/image'
import { isStorageImage } from './storage-image-config.mjs'

// The only way a Supabase Storage image reaches the page. See
// storage-image-config.mjs for why.
//
// Spread the result onto a plain <img>: the markup, class names, loading and
// fetchPriority stay exactly as each component wants them; only src, srcSet and
// sizes change. A Storage URL becomes optimizer URLs (resized, edge-cached for
// a month). Anything else, such as the Webflow CDN fallback, passes through.
//
// tests/storage-images.test.mjs fails the build's test run if an <img> with a
// computed src skips this helper.
export function storageImgProps(src, sizes) {
  if (!isStorageImage(src)) return { src }
  const { props } = getImageProps({ src, alt: '', fill: true, sizes })
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes }
}
