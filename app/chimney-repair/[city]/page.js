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

const SERVICE_SLUG = 'chimney-repair'
const SERVICE_NAME = 'Chimney Repair'

const SERVICE_DATA = {
  hero_image_url: 'https://cdn.prod.website-files.com/6583a3bd0693f08aab1194fe/694441da1f125b0cd8259ddc_chimney-repair-flashing-masonry-restoration.webp',
  hero_description: 'Cracks, spalling brick, and failing mortar get worse every season if left alone. We address structural damage before it becomes a full rebuild, protecting your investment and keeping your system safe.',
  whatsincluded_1_title: 'Mortar Joint Repointing',
  whatsincluded_1_body: 'Deteriorated mortar joints are ground out and replaced to restore structural integrity and stop water penetration.',
  whatsincluded_2_title: 'Spalling Brick Replacement',
  whatsincluded_2_body: 'We remove damaged bricks and replace them with matching units so the repair holds structurally and looks clean.',
  whatsincluded_3_title: 'Flashing Repair & Resealing',
  whatsincluded_3_body: 'We reseal or replace the flashing at your roofline to stop water intrusion at the source.',
  whatsincluded_4_title: 'Crown Repair & Waterproofing',
  whatsincluded_4_body: 'We repair the crown and apply a waterproof sealant to prevent future water damage.',
  signs_1_title: 'You notice water stains on the ceiling or wall near the fireplace',
  signs_1_body: 'Water intrusion near the chimney almost always points to flashing failure or a cracked crown. This needs repair before the next rain season.',
  signs_2_title: 'You see white staining (efflorescence) on the exterior masonry',
  signs_2_body: 'White mineral deposits on brick are a sign that water is actively moving through your chimney structure. Left alone, this accelerates deterioration rapidly.',
  signs_3_title: 'Bricks or mortar are visibly crumbling or missing',
  signs_3_body: 'Physical loss of masonry material is a serious structural concern. This should be addressed immediately — the damage compounds with every freeze cycle.',
  signs_4_title: 'The chimney looks slightly different than it used to — settling or leaning',
  signs_4_body: 'Gradual movement in the chimney structure can signal foundation or footing issues. Worth a professional eye sooner rather than later.',
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
