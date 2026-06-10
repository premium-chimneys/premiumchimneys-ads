import HideChatling from '@/components/v3/HideChatling'
import NavigationBar from '@/components/v3/NavigationBar'
import ServiceHero from '@/components/v3/ServiceHero'
import WhatsIncluded from '@/components/v3/WhatsIncluded'
import Education from '@/components/v3/Education'
import Differentiation from '@/components/v3/Differentiation'
import Reviews from '@/components/v3/Reviews'
import Coupons from '@/components/v3/Coupons'
import Contact from '@/components/v3/Contact'
import Footer from '@/components/v3/Footer'

// V3 is a replica of V2. It renders at /[service]/[city]/v3
// (data fetching and metadata live in that route's page.js).
//
// V3 uses its OWN copies of the section components under components/v3/, so
// editing those (or this wrapper) never affects V1 or V2. Edit components/v3/* freely.
export default function ServicePageV3({ city, service, serviceData, heading, offersMembership }) {
  return (
    <div data-variant="v3">
      <HideChatling />
      <NavigationBar city={city} />
      <ServiceHero city={city} service={service} heading={heading} serviceData={serviceData} />
      <WhatsIncluded city={city} serviceData={serviceData} />
      <Education city={city} serviceData={serviceData} />
      <Differentiation city={city} service={service} />
      <Reviews city={city} />
      <Coupons city={city} />
      <Contact city={city} />
      <Footer city={city} />
    </div>
  )
}
