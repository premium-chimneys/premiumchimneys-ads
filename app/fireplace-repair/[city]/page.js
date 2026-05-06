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

const SERVICE_SLUG = 'fireplace-repair'
const SERVICE_NAME = 'Fireplace Repair'

const SERVICE_DATA = {
  hero_image_url: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441daa14d749f6241b0a1_fireplace-repair-firebox-masonry-damage.webp',
  hero_description: 'A cracked firebox or failing refractory panel is a structural failure in the part of your fireplace designed to contain fire. We repair fireboxes, panels, and surrounds so your system is safe and built to last.',
  whatsincluded_1_title: 'Refractory Panel Replacement',
  whatsincluded_1_body: 'We replace damaged refractory panels with correctly sized, high temperature rated units.',
  whatsincluded_2_title: 'Firebox Brick & Mortar Repair',
  whatsincluded_2_body: 'We repoint failing mortar joints with refractory mortar rated for direct flame exposure.',
  whatsincluded_3_title: 'Firebox Floor Repair',
  whatsincluded_3_body: 'We repair spalled or cracked firebox flooring with appropriate refractory materials.',
  whatsincluded_4_title: 'Smoke Chamber Parging',
  whatsincluded_4_body: 'We parge the smoke chamber smooth to improve draft efficiency and reduce creosote buildup.',
  signs_1_title: 'You see visible cracks in the firebox walls or floor',
  signs_1_body: 'Any crack in the firebox interior is a safety issue. Heat and gases can pass through cracks into surrounding structure. Stop use and schedule repair.',
  signs_2_title: 'The refractory panels have deep gouges, chunks missing, or are separating at the seams',
  signs_2_body: "Panel failure is one of the most urgent fireplace repairs. This is the barrier between fire and your home's framing — it cannot be deferred.",
  signs_3_title: 'Mortar between firebox bricks is soft, crumbling, or falling out',
  signs_3_body: 'Deteriorating mortar in a firebox is a moderate but time-sensitive issue. It will worsen with every fire and should be addressed before the next season.',
  signs_4_title: "You've repaired the same area more than once in recent years",
  signs_4_body: 'Recurring issues in the same spot may indicate a deeper structural or moisture problem. Worth a full evaluation rather than another spot fix.',
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
