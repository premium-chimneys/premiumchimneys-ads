import { getCityData } from '../../../lib/getCityData'
import AnnouncementBar from '../../../components/AnnouncementBar'
import NavigationBar from '../../../components/NavigationBar'
import Hero from '../../../components/Hero'
import Services from '../../../components/Services'
import CaseStudies from '../../../components/CaseStudies'
import FAQ from '../../../components/FAQ'
import Reviews from '../../../components/Reviews'
import Coupons from '../../../components/Coupons'
import Contact from '../../../components/Contact'
import Footer from '../../../components/Footer'
import LegacyTracking from '@/components/tracking/LegacyTracking'

// Cached at the edge rather than re-rendered per request — see the note on
// the /[service]/[city] route.
export const revalidate = 3600

// Nothing prerendered at build; each city is cached on first request. See the
// note on the /[service]/[city] route.
export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }) {
  const { city: citySlug } = await params
  const city = await getCityData(citySlug)
  return {
    title: `Chimney & Fireplace Services in ${city.name} | Premium Chimneys`,
    description: `Premium Chimneys provides expert chimney and fireplace services in ${city.name}. Book your inspection today.`,
  }
}

export default async function Page({ params }) {
  const { city: citySlug } = await params
  const city = await getCityData(citySlug)

  return (
    <div>
      <AnnouncementBar city={city} offersMembership={city.metroplex === 'dfw'} />
      <NavigationBar city={city} />
      <Hero city={city} />
      <Services city={city} />
      <CaseStudies city={city} />
      <FAQ city={city} />
      <Reviews city={city} />
      <Coupons city={city} />
      <Contact city={city} />
      <Footer city={city} />
      {/* Same scripts this page already loaded from the root layout. */}
      <LegacyTracking />
    </div>
  )
}
