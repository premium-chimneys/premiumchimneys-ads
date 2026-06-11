import { notFound } from 'next/navigation'
import { getCityData } from '@/lib/getCityData'
import { getServiceData } from '@/lib/getServiceData'
import { getLandingV2Data } from '@/lib/getLandingV2Data'
import ServicePageV2 from '@/components/variants/ServicePageV2'

function serviceNameFromSlug(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }) {
  const { service: serviceSlug, city: citySlug } = await params
  const city = await getCityData(citySlug)
  const serviceName = serviceNameFromSlug(serviceSlug)
  return {
    title: `${serviceName} in ${city.name} | Premium Chimneys`,
    description: `Professional ${serviceName} in ${city.name}. Trusted local experts. Book your appointment today.`,
  }
}

export default async function Page({ params }) {
  const { service: serviceSlug, city: citySlug } = await params

  const serviceData = await getServiceData(serviceSlug)
  if (!serviceData) notFound()

  const [city, landing] = await Promise.all([
    getCityData(citySlug),
    getLandingV2Data(serviceSlug),
  ])

  const serviceName = serviceNameFromSlug(serviceSlug)
  const heading = `${serviceName} in ${city.name}`
  const offersMembership = city.metroplex === 'dfw'

  return (
    <ServicePageV2
      city={city}
      service={serviceSlug}
      serviceData={serviceData}
      heading={heading}
      offersMembership={offersMembership}
      landing={landing}
    />
  )
}
