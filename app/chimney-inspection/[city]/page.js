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

const SERVICE_SLUG = 'chimney-inspection'
const SERVICE_NAME = 'Chimney Inspection'

const SERVICE_DATA = {
  hero_image_url: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da86840f464e36c79b_chimney-inspection-roofline-flue-evaluation.webp',
  hero_description: 'A chimney inspection gives you a clear picture of your system safety and condition. We evaluate every component from the firebox to the crown so you know exactly where things stand.',
  whatsincluded_1_title: 'Visual Firebox Examination',
  whatsincluded_1_body: 'We inspect the firebox walls, floor, and damper for cracks, spalling, or deteriorating mortar.',
  whatsincluded_2_title: 'Flue & Liner Assessment',
  whatsincluded_2_body: 'We assess the full flue and liner for obstructions, buildup, or damage that could restrict airflow.',
  whatsincluded_3_title: 'Crown & Cap Inspection',
  whatsincluded_3_body: 'We check the crown and cap for cracks or missing components that leave your system exposed to water.',
  whatsincluded_4_title: 'Written Safety Report',
  whatsincluded_4_body: 'Every inspection ends with a clear written summary of findings and honest recommendations.',
  signs_1_title: "It's been over a year since your last inspection",
  signs_1_body: "Annual inspections are the baseline for chimney safety. If you can't remember the last one, it's time.",
  signs_2_title: "You've noticed cracks in your firebox or exterior masonry",
  signs_2_body: 'Visible cracks can indicate serious structural movement or water damage. This warrants an immediate inspection before any use.',
  signs_3_title: "You're seeing smoke enter the room when the fireplace is in use",
  signs_3_body: 'Smoke backdraft suggests a blockage, liner failure, or draft issue. Stop use and schedule an inspection right away.',
  signs_4_title: "You recently bought the home or haven't used the fireplace in years",
  signs_4_body: "Unknown history means unknown risk. A fresh inspection is the only way to know what you're working with.",
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
