import HideChatling from '@/components/v2/HideChatling'
import NavigationBar from '@/components/v2/NavigationBar'
import ServiceHero from '@/components/v2/ServiceHero'
import InspectionValue from '@/components/v2/InspectionValue'
import Portfolio from '@/components/v2/Portfolio'
import Footer from '@/components/Footer'

// V2 is currently an identical copy of V1. It renders at /[service]/[city]/v2
// (data fetching and metadata live in that route's page.js).
//
// V2 uses its OWN copies of the section components under components/v2/, so
// editing those (or this wrapper) never affects V1. Edit components/v2/* freely.
export default function ServicePageV2({ city, service, serviceData, heading, offersMembership, landing }) {
  return (
    <div data-variant="v2">
      <HideChatling />
      <NavigationBar city={city} />
      <ServiceHero city={city} service={service} heading={heading} serviceData={serviceData} landing={landing} />
      <section className="v2-band" style={{ background: '#F5F5F7' }}>
        <InspectionValue city={city} landing={landing} />
        <Portfolio city={city} landing={landing} />
      </section>
      <Footer city={city} />
    </div>
  )
}
