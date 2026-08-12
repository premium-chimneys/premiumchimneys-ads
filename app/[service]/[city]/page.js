import { notFound } from 'next/navigation'
import { getCityData } from '@/lib/getCityData'
import { getServiceData } from '@/lib/getServiceData'
import ServicePageV1 from '@/components/variants/ServicePageV1'
import LegacyTracking from '@/components/tracking/LegacyTracking'

// Without this the page is rendered from scratch on every single request —
// a Supabase round trip per visit, `no-store` on the response, and a permanent
// CDN miss. That server time lands in front of everything else, so a slow
// response drags First Contentful Paint and Largest Contentful Paint with it;
// it is what made the same page score 94 on one run and 61 on the next.
//
// One hour is a deliberate trade: city and service copy changes rarely, so
// almost every visitor gets a cached page from the edge, and an edit in
// Supabase takes up to an hour to appear. Lower the number if that is too long.
export const revalidate = 3600

// ISR needs generateStaticParams to be present, but 454 cities x 9 services is
// ~4,000 pages per variant — far too many to prerender at build time. Returning
// nothing prerenders nothing: with dynamicParams left at its default of true,
// each path is built the first time someone asks for it and then served from
// the cache for the next hour. The first visitor pays the render; nobody else
// does.
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
  // be in both places. Without it, an unknown city reaches `city.name` here and
  // the whole request is a 500 even though the page below knows it is a 404.
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

  const city = await getCityData(citySlug)
  // Same treatment the service slug already got. A URL is only a page when both
  // halves of it name something real.
  if (!city) notFound()

  const serviceName = serviceNameFromSlug(serviceSlug)
  const heading = `${serviceName} in ${city.name}`
  const offersMembership = city.metroplex === 'dfw'

  return (
    <>
      <ServicePageV1
        city={city}
        service={serviceSlug}
        serviceData={serviceData}
        heading={heading}
        offersMembership={offersMembership}
      />
      {/* Unchanged behaviour — these are the same scripts, strategies and
          order this page has always had; they simply moved out of the root
          layout so V2 could load them differently. */}
      <LegacyTracking />
    </>
  )
}
