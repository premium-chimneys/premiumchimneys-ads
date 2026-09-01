import Script from 'next/script'
import BookingLoader from './BookingLoader'
import ChatLeadTracking from './ChatLeadTracking'

// V2's third-party stack. Same vendors and same container ids as
// LegacyTracking — only the loading schedule differs.
//
// Kept at afterInteractive (unchanged):
//   GTM  — this is a paid-traffic host. lazyOnload only injects during idle
//          after the load event, so anyone who bounces before that fires
//          would produce no page_view and no conversion tag, and the
//          conversion linker would never turn the gclid into the _gcl_aw
//          cookie. That is Google Ads bid signal, not just a report. It is
//          also what Next's own docs put tag managers under.
//   WhatConverts — primary lead tracking. Number replacement has to happen
//          before a visitor reads the phone number, and wc-init must stay
//          immediately ahead of wc-loader: it defines the $wc_leads object
//          that 137765.js reads on boot.
//
// Moved to lazyOnload:
//   Clarity  — session replay. Loses the first moments of the recording,
//              which is an acceptable trade for keeping it off the critical
//              path entirely.
//   Agent HQ — a chat widget, the textbook lazyOnload case.
//
// booking.js is handled by BookingLoader rather than a strategy, because a
// plain lazyOnload would leave the hero CTA dead until it landed. See there.
export default function OptimizedTracking() {
  return (
    <>
      <Script id="gtm-loader" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PBJDQCV7');`}
      </Script>

      <Script id="wc-init" strategy="afterInteractive">
        {`var $wc_load=function(a){return JSON.parse(JSON.stringify(a))},$wc_leads=$wc_leads||{doc:{url:$wc_load(document.URL),ref:$wc_load(document.referrer),search:$wc_load(location.search),hash:$wc_load(location.hash)}};`}
      </Script>
      <Script
        id="wc-loader"
        src="https://s.ksrndkehqnwntyxlhgto.com/137765.js"
        strategy="afterInteractive"
      />

      {/* Hands chat leads to WhatConverts. Mounted here, after wc-loader, on
          purpose: WhatConverts requires its own tag to load ahead of the chat
          tracking code. */}
      <ChatLeadTracking />

      <Script id="clarity-init" strategy="lazyOnload">
        {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "sa99g7wtlu");`}
      </Script>

      <Script
        id="agent-hq-chat"
        src="https://agents.premiumchimneys.com/chat.js"
        strategy="lazyOnload"
        data-tenant="premium-chimneys"
      />

      <BookingLoader />

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PBJDQCV7"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}
