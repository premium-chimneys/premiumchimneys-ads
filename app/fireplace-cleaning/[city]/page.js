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

const SERVICE_SLUG = 'fireplace-cleaning'
const SERVICE_NAME = 'Fireplace Cleaning'

const SERVICE_DATA = {
  hero_image_url: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441dab6643a9d596b5d77_fireplace-cleaning-hepa-vacuum-soot-removal.webp',
  hero_description: 'Soot and ash are mildly corrosive and will degrade your firebox over time if left sitting. We remove all buildup from the firebox, smoke chamber, and glass so your system performs like new.',
  whatsincluded_1_title: 'Firebox Deep Clean',
  whatsincluded_1_body: 'We remove all ash, soot, and debris from the firebox using HEPA filtered equipment.',
  whatsincluded_2_title: 'Glass Door Cleaning',
  whatsincluded_2_body: 'Glass doors are cleaned inside and out with non abrasive products that restore clarity without scratching.',
  whatsincluded_3_title: 'Smoke Chamber Brushing',
  whatsincluded_3_body: 'We brush the full smoke chamber and vacuum all loosened material before it falls back into the firebox.',
  whatsincluded_4_title: 'Damper & Throat Clearing',
  whatsincluded_4_body: 'We clear soot and debris from the damper and throat area to restore proper airflow.',
  signs_1_title: "The glass doors are heavily blackened and you can't see through them",
  signs_1_body: 'Opaque glass is a sign of incomplete combustion or poor airflow — worth cleaning and then noting whether the issue recurs.',
  signs_2_title: "There's a heavy ash and soot smell even when the fireplace isn't running",
  signs_2_body: 'Lingering odor between uses suggests significant buildup in the firebox or smoke chamber that needs to be cleared out.',
  signs_3_title: 'Ash has been sitting in the firebox for more than one season',
  signs_3_body: 'Old ash absorbs moisture and becomes mildly acidic. Letting it sit long-term accelerates firebox floor and wall degradation.',
  signs_4_title: "You're heading into or out of burning season",
  signs_4_body: 'A clean fireplace at the start of the season performs better and gives you a fresh baseline. At the end of the season, cleaning prevents off-season moisture damage.',
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
