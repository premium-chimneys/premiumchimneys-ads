import { imagesConfig } from './lib/storage-image-config.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supabase Storage images are resized and edge-cached through next/image.
  // See lib/storage-image-config.mjs.
  images: imagesConfig,
};

export default nextConfig;
