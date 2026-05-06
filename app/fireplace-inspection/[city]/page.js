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

const SERVICE_SLUG = 'fireplace-inspection'
const SERVICE_NAME = 'Fireplace Inspection'

const SERVICE_DATA = {
  hero_image_url: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da89a8a6b303d8e2cd_fireplace-inspection-wood-stove-firebox-check.webp',
  hero_description: 'Your fireplace is a combustion system inside your home and it deserves to be treated like one. We confirm every component is intact and the system is safe to operate before another season begins.',
  whatsincluded_1_title: 'Firebox Wall & Floor Inspection',
  whatsincluded_1_body: 'We examine the firebox interior for cracks or heat damage that could allow gases to reach surrounding framing.',
  whatsincluded_2_title: 'Damper Operation & Seal Check',
  whatsincluded_2_body: 'We test the damper operation and seal, and note if repair or replacement would benefit you.',
  whatsincluded_3_title: 'Smoke Chamber Evaluation',
  whatsincluded_3_body: 'We inspect the smoke chamber for damage that could compromise draft performance or safety.',
  whatsincluded_4_title: 'Hearth Extension & Surround Review',
  whatsincluded_4_body: 'We check the hearth extension and surround for proper clearance and signs of heat damage.',
  signs_1_title: "You haven't had the fireplace inspected since moving in",
  signs_1_body: 'Previous owners may have used it heavily or made modifications. You have no way to know the condition without an inspection.',
  signs_2_title: "The damper feels stiff, sticky, or won't fully close",
  signs_2_body: 'Damper issues can mean warping from heat, rust, or debris obstruction. A fully stuck damper needs immediate attention before use.',
  signs_3_title: "You notice a musty or smoky smell coming from the fireplace when it's closed",
  signs_3_body: 'Odor with the damper closed suggests the seal is failing and outside air — along with whatever is in the flue — is entering your living space.',
  signs_4_title: "The fireplace hasn't been used in multiple years",
  signs_4_body: "Inactivity doesn't mean safe. Moisture, pests, and slow material degradation happen regardless of use. Inspect before restarting.",
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
