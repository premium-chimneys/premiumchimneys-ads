import Script from 'next/script'
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
        <script defer src="https://cdn.serviceroot.io/capture.js" data-tenant="premium-chimneys"></script>
        <script async src="https://gateway.serviceroot.io/booking.js" data-tenant="premium-chimneys" data-mode="popup"></script>
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
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PBJDQCV7');`}
        </Script>

        {/* The standalone GA4 tag that used to live here has been removed.
            GTM-PBJDQCV7 already loads GA4 for G-8H95KCD7EY (3 config tags and
            5 event tags in the published container), so this was a second,
            duplicate load of the same measurement ID. */}

        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "sa99g7wtlu");`}
        </Script>

        <Script id="wc-init" strategy="afterInteractive">
          {`var $wc_load=function(a){return JSON.parse(JSON.stringify(a))},$wc_leads=$wc_leads||{doc:{url:$wc_load(document.URL),ref:$wc_load(document.referrer),search:$wc_load(location.search),hash:$wc_load(location.hash)}};`}
        </Script>
        <Script
          id="wc-loader"
          src="https://s.ksrndkehqnwntyxlhgto.com/137765.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PBJDQCV7"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <TrackingCapture />
        <ElfsightLoader />
        {children}

        {/* The chat widget, now served by Agent HQ rather than by Gateway — the
            same swap the marketing site made, so a visitor who lands here from
            an ad is answered by the same agent, and the conversation, the
            transcript and the lead live with it. The widget is origin-agnostic;
            this host is on its CORS allowlist. Gateway still receives the lead,
            posted server-side. */}
        <Script
          id="agent-hq-chat"
          src="https://agents.premiumchimneys.com/chat.js"
          strategy="afterInteractive"
          data-tenant="premium-chimneys"
        />
      </body>
    </html>
  )
}
