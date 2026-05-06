import { getCityData } from '@/lib/getCityData'
import AnnouncementBar from '@/components/AnnouncementBar'
import NavigationBar from '@/components/NavigationBar'
import ServiceHero from '@/components/ServiceHero'
import WhatsIncluded from '@/components/WhatsIncluded'
import Education from '@/components/Education'
import Differentiation from '@/components/Differentiation'
import Reviews from '@/components/Reviews'
import Coupons from '@/components/Coupons'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

const SERVICE_SLUG = 'fireplace-maintenance'
const SERVICE_NAME = 'Fireplace Maintenance'

const SERVICE_DATA = {
  hero_image_url: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da14746f8ed1a7a600_fireplace-maintenance-safe-home-use.webp',
  hero_description: 'Regular maintenance is what separates a fireplace that lasts decades from one that quietly deteriorates season after season. We cover all the small but critical items that keep your system efficient, clean, and safe.',
  whatsincluded_1_title: 'Full System Inspection & Cleaning',
  whatsincluded_1_body: 'Every visit starts with a full top to bottom inspection and clean of the firebox, damper, and flue.',
  whatsincluded_2_title: 'Damper Lubrication & Adjustment',
  whatsincluded_2_body: 'We service the damper hardware so it operates smoothly and seals fully for better efficiency.',
  whatsincluded_3_title: 'Gasket & Seal Inspection',
  whatsincluded_3_body: 'We check door gaskets and seals for compression loss and replace them where needed.',
  whatsincluded_4_title: 'Minor Repair Identification & Triage',
  whatsincluded_4_body: 'We document any developing issues and give you a clear picture of what to watch going forward.',
  signs_1_title: 'You schedule an annual service on most other home systems but not the fireplace',
  signs_1_body: 'HVAC, water heater, gutters — most homeowners maintain these annually. The fireplace deserves the same cadence.',
  signs_2_title: 'The fireplace seems to be burning less efficiently than it used to',
  signs_2_body: 'Reduced performance — more smoke, less heat, harder to start — often signals multiple small issues accumulating. A maintenance visit diagnoses and resolves them.',
  signs_3_title: "You're noticing small issues but nothing dramatic enough to call for repair",
  signs_3_body: 'This is exactly the right time for maintenance. Catching developing issues early is always cheaper than waiting for a failure.',
  signs_4_title: 'You want confidence heading into the burning season',
  signs_4_body: 'A pre-season maintenance visit is the cleanest way to start fall and winter knowing your fireplace is fully ready.',
}

export async function generateMetadata({ params }) {
  const { city: citySlug } = await params
  const city = await getCityData(citySlug)
  return {
    title: `${SERVICE_NAME} in ${city.name} | Premium Chimneys`,
    description: `Professional ${SERVICE_NAME} in ${city.name}. Trusted local experts. Book your appointment today.`,
  }
}

export default async function Page({ params }) {
  const { city: citySlug } = await params
  const city = await getCityData(citySlug)

  const heading = `${SERVICE_NAME} in ${city.name}`
  const offersMembership = city.metroplex === 'dfw'

  return (
    <div>
      <AnnouncementBar city={city} offersMembership={offersMembership} />
      <NavigationBar city={city} />
      <ServiceHero city={city} service={SERVICE_SLUG} heading={heading} serviceData={SERVICE_DATA} />
      <WhatsIncluded city={city} serviceData={SERVICE_DATA} />
      <Education city={city} serviceData={SERVICE_DATA} />
      <Differentiation city={city} service={SERVICE_SLUG} />
      <Reviews city={city} />
      <Coupons city={city} />
      <Contact city={city} />
      <Footer city={city} />
    </div>
  )
}
