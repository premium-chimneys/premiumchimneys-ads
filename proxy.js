import { NextResponse } from 'next/server';
import { captureServerAttribution } from './lib/form-attribution.mjs';

export function proxy(request) {
  return captureServerAttribution(request, NextResponse.next());
}
export const config = {
  matcher: ['/((?!api/|_next/|images/|videos/|fonts/|favicon.ico|robots.txt|sitemap.xml).*)'],
};
