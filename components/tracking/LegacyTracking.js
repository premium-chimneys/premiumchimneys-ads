import Script from 'next/script'

// The third-party stack exactly as it shipped when it lived in the root layout.
//
// It moved out of `app/layout.js` so that V2 could load the same vendors on a
// different schedule (see OptimizedTracking). A root layout cannot branch on
// the route, so the only way to give one variant its own loading behaviour is
// for every branch to mount its own set. Nothing here changed in the move:
// same tags, same ids, same strategies, same order.
//
// Mounted by V1, /homepage/*, /sub/* and the bare root page — i.e.
// everything that is not V2.
//
// capture.js is deliberately NOT here. It stays a parser-inserted
// `<script defer>` in the root layout's <head> for every route, so its
// placement is identical for all variants.
export default function LegacyTracking() {
  return (
    <>
      <script
        async
        src="https://gateway.serviceroot.io/booking.js"
        data-tenant="premium-chimneys"
        data-mode="popup"
      ></script>

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

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PBJDQCV7"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

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
    </>
  )
}
