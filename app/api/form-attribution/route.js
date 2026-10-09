import { cookies } from 'next/headers';
import { ATTRIBUTION_COOKIE, readAttribution } from '@/lib/form-attribution.mjs';

export const dynamic = 'force-dynamic';
export async function GET() {
  const jar = await cookies();
  return Response.json({ tenant: 'premium-chimneys', params: readAttribution(jar.get(ATTRIBUTION_COOKIE)?.value) },
    { headers: { 'Cache-Control': 'private, no-store', 'Vary': 'Cookie', 'X-Content-Type-Options': 'nosniff' } });
}

