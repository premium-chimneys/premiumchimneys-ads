import { getCityData } from '@/lib/getCityData'
import { getServiceData } from '@/lib/getServiceData'
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

const serviceNames = {
  'chimney-inspection': 'Chimney Inspection',
  'chimney-sweep': 'Chimney Sweep',
  'chimney-repair': 'Chimney Repair',
  'chimney-caps': 'Chimney Caps',
  'fireplace-inspection': 'Fireplace Inspection',
  'fireplace-cleaning': 'Fireplace Cleaning',
  'fireplace-repair': 'Fireplace Repair',
  'fireplace-maintenance': 'Fireplace Maintenance',
  'gas-fireplace-repair': 'Gas Fireplace Repair',
}

export async function generateMetadata({ params }) {
  const { service, city: citySlug } = await params
  const city = await getCityData(citySlug)
  const serviceName = serviceNames[service]
  return {
    title: `${serviceName} in ${city.name} | Premium Chimneys`,
    description: `Professional ${serviceName} in ${city.name}. Trusted local experts. Book your appointment today.`,
  }
}

export default async function Page({ params }) {
  const { service, city: citySlug } = await params
  const [city, serviceData] = await Promise.all([
    getCityData(citySlug),
    getServiceData(service),
  ])

  const heading = `${serviceNames[service]} in ${city.name}`
  const offersMembership = city.metroplex === 'dfw'

  return (
    <div>
      <AnnouncementBar city={city} offersMembership={offersMembership} />
      <NavigationBar city={city} />
      <ServiceHero city={city} service={service} heading={heading} serviceData={serviceData} />
      <WhatsIncluded city={city} serviceData={serviceData} />
      <Education city={city} serviceData={serviceData} />
      <Differentiation city={city} service={service} />
      <Reviews city={city} />
      <Coupons city={city} />
      <Contact city={city} />
      <Footer city={city} />
    </div>
  )
}
