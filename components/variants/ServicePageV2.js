import AnnouncementBar from '@/components/v2/AnnouncementBar'
import NavigationBar from '@/components/v2/NavigationBar'
import ServiceHero from '@/components/v2/ServiceHero'
import WhatsIncluded from '@/components/v2/WhatsIncluded'
import Education from '@/components/v2/Education'
import Differentiation from '@/components/v2/Differentiation'
import Reviews from '@/components/v2/Reviews'
import Coupons from '@/components/v2/Coupons'
import Contact from '@/components/v2/Contact'
import Footer from '@/components/v2/Footer'

// V2 is currently an identical copy of V1. It renders at /[service]/[city]/v2
// (data fetching and metadata live in that route's page.js).
//
// V2 uses its OWN copies of the section components under components/v2/, so
// editing those (or this wrapper) never affects V1. Edit components/v2/* freely.
export default function ServicePageV2({ city, service, serviceData, heading, offersMembership }) {
  return (
    <div data-variant="v2">
      <AnnouncementBar city={city} offersMembership={offersMembership} />
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
