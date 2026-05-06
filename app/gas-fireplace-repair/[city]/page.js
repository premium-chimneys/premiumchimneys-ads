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

const SERVICE_SLUG = 'gas-fireplace-repair'
const SERVICE_NAME = 'Gas Fireplace Repair'

const SERVICE_DATA = {
  hero_image_url: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da03f91ef31c0da8f9_gas-fireplace-repair-burner-flame-performance.webp',
  hero_description: 'A pilot that will not stay lit or a burner with an irregular flame are signs your gas fireplace needs attention. We diagnose and repair gas fireplace systems so they operate safely and reliably.',
  whatsincluded_1_title: 'Pilot & Ignition System Service',
  whatsincluded_1_body: 'We clean and test the pilot assembly, thermocouple, and igniter to resolve most ignition failures.',
  whatsincluded_2_title: 'Burner & Orifice Cleaning',
  whatsincluded_2_body: 'We clean the burner and orifice to restore proper combustion and even flame output.',
  whatsincluded_3_title: 'Gas Valve & Pressure Testing',
  whatsincluded_3_body: 'We test the gas valve for correct operation and verify inlet pressure is within spec.',
  whatsincluded_4_title: 'Logs, Media & Ember Bed Refresh',
  whatsincluded_4_body: 'We reposition or replace ceramic logs and media to restore the original look and flame pattern.',
  signs_1_title: "The pilot light goes out repeatedly or won't stay lit",
  signs_1_body: "A pilot that won't hold is usually a thermocouple issue — a routine repair. But it should be addressed before continued use, as a failed thermocouple is a safety control.",
  signs_2_title: "The unit won't ignite at all",
  signs_2_body: 'Complete ignition failure could mean a gas valve issue, wiring fault, or control board failure. This needs a diagnostic before any further attempts to light.',
  signs_3_title: 'The flame is yellow, uneven, or significantly smaller than it used to be',
  signs_3_body: 'Flame quality issues indicate a burner or gas supply problem. Yellow flames in particular signal incomplete combustion — a moderate concern that warrants prompt service.',
  signs_4_title: "You smell gas near the fireplace even when it's off",
  signs_4_body: 'Any gas smell when the unit is off is an urgent safety issue. Do not attempt to use the fireplace. Ventilate the area and call for service immediately.',
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
