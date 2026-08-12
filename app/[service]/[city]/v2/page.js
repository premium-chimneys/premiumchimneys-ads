import { notFound } from 'next/navigation'
import { getCityData } from '@/lib/getCityData'
import { getServiceData } from '@/lib/getServiceData'
import { getLandingV2Data } from '@/lib/getLandingV2Data'
import { getV2HeroImage } from '@/lib/getV2HeroImage'
import ServicePageV2 from '@/components/variants/ServicePageV2'

// Serve from the edge instead of re-rendering per request — see the note on
// the V1 route. Same one hour window, so both variants go stale together and
// stay comparable.
export const revalidate = 3600

// Nothing prerendered at build; each path is cached on first request. See the
// note on the V1 route.
export function generateStaticParams() {
  return []
}

function serviceNameFromSlug(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }) {
  const { service: serviceSlug, city: citySlug } = await params
  const city = await getCityData(citySlug)
  // Metadata runs alongside the page rather than after it, so the guard has to
  // be in both places — see the V1 route.
  if (!city) notFound()

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
  // Same treatment the service slug already got. Before the hero lookup below,
  // which reads city.metroplex.
  if (!city) notFound()

  // V2-only: swap the hero image based on service group + metroplex. Falls back
  // to the existing services.hero_image_url when there's no mapping, so V1 is
  // untouched and V2 keeps the old image until the table is populated.
  const v2HeroImage = await getV2HeroImage(serviceSlug, city.metroplex)
  const serviceDataV2 = v2HeroImage
    ? { ...serviceData, hero_image_url: v2HeroImage }
    : serviceData

  const serviceName = serviceNameFromSlug(serviceSlug)
  const heading = `${serviceName} in ${city.name}`
  const offersMembership = city.metroplex === 'dfw'

  return (
    <ServicePageV2
      city={city}
      service={serviceSlug}
      serviceData={serviceDataV2}
      heading={heading}
      offersMembership={offersMembership}
      landing={landing}
    />
  )
}
