import TrackingCapture from '@/components/TrackingCapture'
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
      </head>
      <body>
        <TrackingCapture />
        <ElfsightLoader />
        {children}
      </body>
    </html>
  )
}
