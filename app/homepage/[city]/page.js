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
      <AnnouncementBar city={city} offersMembership={city.metroplex === 'dallas'} />
      <NavigationBar city={city} />
      <Hero city={city} />
      <Services city={city} />
      <CaseStudies city={city} />
      <FAQ city={city} />
      <Reviews city={city} />
      <Coupons city={city} />
      <Contact city={city} />
      <Footer city={city} />
    </div>
  )
}
