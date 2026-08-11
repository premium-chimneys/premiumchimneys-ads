import TrackingCapture from '@/components/TrackingCapture'
import AnimationGate from '@/components/AnimationGate'
import ElfsightLoader from '@/components/ElfsightLoader'
import './globals.css'

export const metadata = {
  title: 'Premium Chimneys',
  description: 'Professional chimney services',
  icons: {
    apple: '/webclip.png',
  },
  verification: {
    google: '51dAetmHAT8n_2vVe6YqPxlTYLoEQjlZnVbzPB1ECSk',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* capture.js only registers a capture-phase `submit` listener and reads
            the URL at submit time, so it costs nothing above the fold and is
            left exactly where it has always been — a parser-inserted, deferred
            tag in <head> — for every route and every variant.

            Everything else third-party now lives in a per-branch tracking
            component instead of here: LegacyTracking for V1 and the rest of
            the site, OptimizedTracking for V2. A root layout cannot branch on
            the route, so giving V2 its own loading schedule meant no variant
            can inherit one from here. */}
        <script defer src="https://cdn.serviceroot.io/capture.js" data-tenant="premium-chimneys"></script>
        {/* Inter Tight is self-hosted in globals.css, so there is no longer a
            Google Fonts origin to warm up. Roboto's stylesheet lived here too
            and was render-blocking on every page, but nothing sets Roboto as
            body copy — its only use is a rule styling the text *inside* the
            Elfsight reviews widget, which now falls through to that rule's own
            -apple-system / Segoe UI fallbacks. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/inter-tight-var-latin.woff2"
          crossOrigin="anonymous"
        />
        {/* The LCP element on every service page is the hero image, and it is
            served from Supabase storage — a different origin, so the browser
            pays DNS + TCP + TLS before the first byte arrives. Warming the
            connection here overlaps that handshake with parsing the document
            instead of stacking it in front of the image. */}
        <link rel="preconnect" href="https://labekmkkpbgrxfpcsyvz.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://labekmkkpbgrxfpcsyvz.supabase.co" />
      </head>
      {/* data-anim-hold parks every CSS animation on the page until it has
          loaded and gone quiet — see globals.css and AnimationGate. It ships
          in the server HTML on purpose: the cost it removes is paid during
          load, so lifting it client-side would be too late to matter. */}
      <body data-anim-hold="">
        <TrackingCapture />
        <ElfsightLoader />
        <AnimationGate />
        {children}
      </body>
    </html>
  )
}
