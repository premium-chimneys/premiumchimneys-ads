import AnnouncementBar from '@/components/v2/AnnouncementBar'
import NavigationBar from '@/components/v2/NavigationBar'
import ServiceHero from '@/components/v2/ServiceHero'
import WorkGallery from '@/components/v2/WorkGallery'
import WhatsIncluded from '@/components/v2/WhatsIncluded'
import Education from '@/components/v2/Education'
import Differentiation from '@/components/v2/Differentiation'
import Reviews from '@/components/v2/Reviews'
import Coupons from '@/components/v2/Coupons'
import Contact from '@/components/v2/Contact'
import Footer from '@/components/v2/Footer'

// V2 is an identical copy of V1, kept for A/B testing (e.g. small hero tweaks).
// It renders at /[service]/[city]/v2 (data fetching + metadata live in that
// route's page.js) and uses its OWN copies of every section under
// components/v2/, so editing those (or this wrapper) never affects V1.
// Edit components/v2/* freely.
export default function ServicePageV2({ city, service, serviceData, heading, offersMembership }) {
  return (
    <div data-variant="v2">
      <AnnouncementBar city={city} offersMembership={offersMembership} />
      <NavigationBar city={city} />
      <ServiceHero city={city} service={service} heading={heading} serviceData={serviceData} />
      <WorkGallery city={city} service={service} serviceData={serviceData} />
      <WhatsIncluded city={city} serviceData={serviceData} />
      <Education city={city} serviceData={serviceData} />
      <Differentiation city={city} service={service} />
      <Reviews />
      <Coupons city={city} />
      <Contact city={city} />
      <Footer city={city} />
    </div>
  )
}
