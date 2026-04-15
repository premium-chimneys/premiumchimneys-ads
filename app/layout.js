import Script from 'next/script'
import TrackingCapture from '@/components/TrackingCapture'
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
        <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
        <Script
          id="calendly-widget"
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
        <Script
          id="elfsight-platform"
          src="https://elfsightcdn.com/platform.js"
          strategy="afterInteractive"
        />

        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PBJDQCV7');`}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8H95KCD7EY"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-8H95KCD7EY');`}
        </Script>

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

        <Script id="chatling-config" strategy="afterInteractive">
          {`window.chtlConfig = { chatbotId: "7441393689", customAttributes: { page_url: window.location.href } };`}
        </Script>
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
        {children}

        <Script
          id="chatling-embed-script"
          src="https://chatling.ai/js/embed.js"
          strategy="afterInteractive"
          data-id="7441393689"
        />
      </body>
    </html>
  )
}
