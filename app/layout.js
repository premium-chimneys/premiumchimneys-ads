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
  // The hero location pill prints a full postal address as plain text
  // (city.service_area, e.g. "9330 Lyndon B Johnson Fwy #958, Dallas, TX
  // 75243"). iOS Safari detects that and silently turns it into a link of its
  // own — underlined in a style we never wrote, opening the Maps action sheet
  // when tapped. Nothing in our markup does this; the pill is plain spans.
  //
  // Only `address` is switched off. `telephone` and `email` are deliberately
  // left alone: every phone number and every email on the site already sits
  // inside an explicit <a href="tel:"> or <a href="mailto:">, so nothing
  // depends on auto-detection and turning those off would change nothing.
  // Disabling only what is actually broken keeps the real links untouched.
  formatDetection: {
    address: false,
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
        {/* First-party visitor counting. Served from the CRM app, like chat.js,
            so how a visit is counted is one file in one repo rather than three
            copies that drift.

            Deferred and parser-inserted, in the same slot and for the same
            reason as capture.js above: it registers a few passive listeners and
            posts a beacon, so it costs nothing above the fold and there is no
            variant that should be without it.

            data-site is declared rather than read from location.hostname on
            purpose — preview deployments and the apex/www pair would otherwise
            each become their own site in the rollup and split the numbers. */}
        <script defer src="https://agents.premiumchimneys.com/pv.js" data-site="book.premiumchimneys.com"></script>
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
