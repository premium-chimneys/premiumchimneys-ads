import { imagesConfig } from './lib/storage-image-config.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supabase Storage images are resized and edge-cached through next/image.
  // See lib/storage-image-config.mjs.
  images: imagesConfig,
  // The old Flower Mound homepage still has links out there (the Yelp listing
  // had it). Send them to the Flower Mound location page. Any tags on the link
  // (utm_source…) carry over. Temporary (307) so it can be undone cleanly.
  // The private /popup stats page must never be indexed. The page sets a
  // robots meta tag too; the header also covers crawlers that skip the HTML.
  async headers() {
    return [{
      source: '/popup',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
    }];
  },
  async redirects() {
    return [{
      source: '/homepage/flower-mound-tx',
      destination: 'https://www.premiumchimneys.com/locations/flower-mound-tx',
      permanent: false,
    }];
  },
};

export default nextConfig;
