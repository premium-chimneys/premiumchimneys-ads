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

const SERVICE_SLUG = 'chimney-caps'
const SERVICE_NAME = 'Chimney Caps'

const SERVICE_DATA = {
  hero_image_url: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/6944464c3d3dac45d014f642_chimney-cap-installation-metal-roof.webp',
  hero_description: 'Our team handles everything relating to chimney caps whether you need a chimney cap installation, replacement, or repair.',
  whatsincluded_1_title: 'Custom-Fit Cap Sizing',
  whatsincluded_1_body: 'We measure your flue opening precisely and select a cap that fits correctly every time.',
  whatsincluded_2_title: 'Stainless or Copper Cap Options',
  whatsincluded_2_body: 'We install durable galvanized steel caps as standard with stainless and copper available for homes where aesthetics matter.',
  whatsincluded_3_title: 'Animal & Debris Mesh Guard',
  whatsincluded_3_body: 'Every cap includes a mesh skirt that blocks birds, squirrels, and raccoons from nesting in your flue.',
  whatsincluded_4_title: 'Secure Mounting & Seal',
  whatsincluded_4_body: 'Caps are secured with stainless screws and sealed at the base to keep water out in any weather.',
  signs_1_title: "You don't currently have a cap — or you're not sure",
  signs_1_body: 'If your chimney has no cap, every rainstorm is sending water directly into your flue. This is the single easiest fix with the highest protective value.',
  signs_2_title: 'An animal has gotten into your chimney or fireplace',
  signs_2_body: 'If something has already gotten in, your cap is missing or failed. This needs to be addressed immediately — animals can become trapped and create serious hazards.',
  signs_3_title: "You're finding debris, leaves, or nesting material in the firebox",
  signs_3_body: 'Debris falling into the firebox is a clear sign the flue is open and unprotected. A cap resolves this completely.',
  signs_4_title: 'Your existing cap is rusted, bent, or sitting loose',
  signs_4_body: "A damaged cap provides little protection. If it's visibly degraded or shifting in the wind, replacement is overdue.",
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

  const heading = `Chimney Cap Services in ${city.name}`
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
