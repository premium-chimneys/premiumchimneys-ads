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

const SERVICE_SLUG = 'chimney-sweep'
const SERVICE_NAME = 'Chimney Sweep'

const SERVICE_DATA = {
  hero_image_url: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441dad118f5b09b76612a_chimney-sweep-roof-brush-flue-cleaning.webp',
  hero_description: 'Creosote builds up every time you burn and it is the leading cause of chimney fires. We remove dangerous deposits from your flue and firebox, restoring safe airflow and protecting your home.',
  whatsincluded_1_title: 'Creosote & Soot Removal',
  whatsincluded_1_body: 'We clear all stages of creosote buildup from your flue walls using professional grade brushes and vacuum equipment.',
  whatsincluded_2_title: 'Firebox & Smoke Chamber Cleaning',
  whatsincluded_2_body: 'We clean the firebox and smoke chamber thoroughly so your system drafts cleanly from bottom to top.',
  whatsincluded_3_title: 'Debris & Blockage Clearing',
  whatsincluded_3_body: 'Leaves, animal nesting, and other obstructions inside the flue are removed completely.',
  whatsincluded_4_title: 'Post-Sweep Condition Notes',
  whatsincluded_4_body: 'After every sweep we give you a brief condition update and flag anything that needs attention.',
  signs_1_title: 'You burn wood regularly through the season',
  signs_1_body: 'If you use your fireplace more than a few times a month, an annual sweep is the minimum. Heavy users should sweep every season.',
  signs_2_title: 'You see thick black flaking inside the flue or firebox',
  signs_2_body: 'Flaking black deposits are a sign of Stage 2 or Stage 3 creosote — a serious fire hazard that needs immediate professional removal.',
  signs_3_title: "You smell a strong smoky or tarry odor even when the fireplace isn't in use",
  signs_3_body: 'Persistent odor between fires usually means heavy creosote accumulation. This is a moderate warning sign that a sweep is overdue.',
  signs_4_title: "It's been more than 12 months since your last cleaning",
  signs_4_body: 'Even light users should sweep annually. Time-based buildup happens regardless of how often you burn.',
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
