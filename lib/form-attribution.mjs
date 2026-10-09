export const ATTRIBUTION_COOKIE = 'sr_form_attribution';
export const ATTRIBUTION_TTL = 30 * 86400;
export const TRACKING_NAMES = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','gclid','gbraid','wbraid','msclkid','fbclid'];

export function trackingParams(searchParams) {
  const params = {};
  for (const name of TRACKING_NAMES) {
    const value = searchParams.get(name);
    if (value && value.length <= 512) params[name] = value;
  }
  // Keep the complete cookie comfortably below browsers' 4 KB limit.
  return encodeURIComponent(JSON.stringify(params)).length <= 3000 ? params : {};
}

export function attributionCookie(url, now = Date.now()) {
  const params = trackingParams(new URL(url).searchParams);
  return Object.keys(params).length ? JSON.stringify({ params, expires: now + ATTRIBUTION_TTL * 1000 }) : null;
}

export function readAttribution(value, now = Date.now()) {
  try {
    if (!value || value.length > 3500) return {};
    const saved = JSON.parse(value);
    if (!Number.isSafeInteger(saved.expires) || saved.expires <= now || saved.expires > now + ATTRIBUTION_TTL * 1000 ||
        !saved.params || typeof saved.params !== 'object' || Array.isArray(saved.params)) return {};
    const params = {};
    for (const name of TRACKING_NAMES) {
      const value = saved.params[name];
      if (typeof value === 'string' && value.length <= 512) params[name] = value;
    }
    return params;
  } catch { return {}; }
}

export function captureServerAttribution(request, response) {
  // Only real document arrivals: prefetches/API/assets must not change campaigns.
  if (request.method !== 'GET' || !request.headers.get('accept')?.includes('text/html') ||
      request.headers.has('next-router-prefetch') || request.headers.get('purpose') === 'prefetch') return response;
  const value = attributionCookie(request.url);
  if (value) response.cookies.set(ATTRIBUTION_COOKIE, value, {
    httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: ATTRIBUTION_TTL,
  });
  return response;
}

