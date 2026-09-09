import { notFound } from 'next/navigation'
import { getCityData } from '@/lib/getCityData'
import AnnouncementBar from '@/components/AnnouncementBar'
import NavigationBar from '@/components/NavigationBar'
import BookServiceLinks from '@/components/BookServiceLinks'
import Reviews from '@/components/Reviews'
import Coupons from '@/components/Coupons'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import LegacyTracking from '@/components/tracking/LegacyTracking'

const CITY_SLUG = 'flower-mound-tx'
const PAGE_URL = 'https://book.premiumchimneys.com/services/flower-mound-tx'

export const revalidate = 3600

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }) {
  const { city: citySlug } = await params
  if (citySlug !== CITY_SLUG) {
    return { robots: { index: false, follow: false } }
  }
  return {
    title: 'Chimney & Fireplace Services in Flower Mound, TX | Premium Chimneys',
    description:
      'Chimney repair, cleaning, and fireplace services across Flower Mound, TX. Every service we offer, in one place. Call (469) 587-8303.',
    alternates: { canonical: PAGE_URL },
    openGraph: {
      title: 'Chimney & Fireplace Services in Flower Mound, TX',
      description: 'Every chimney and fireplace service we offer in Flower Mound, in one place.',
      url: PAGE_URL,
      type: 'website',
      siteName: 'Premium Chimneys',
    },
  }
}

export default async function Page({ params }) {
  const { city: citySlug } = await params
  if (citySlug !== CITY_SLUG) notFound()

  const city = await getCityData(citySlug)
  if (!city) notFound()

  return (
    <div>
      <AnnouncementBar city={city} offersMembership={city.metroplex === 'dfw'} />
      <NavigationBar city={city} />

      <section className="svh-hero">
        <div className="svh-wrap">
          <p className="svh-eyebrow">Chimney &amp; Fireplace Care</p>
          <h1 className="svh-h1">Our services in Flower Mound, TX</h1>
          <p className="svh-lede">
            Everything we do for Flower Mound homes, in one place. Repairs, cleaning,
            inspection and gas work, all handled by the same team and documented the same way.
          </p>
          <a href={`tel:${city.phone}`} className="svh-cta">{city.phone_text}</a>
        </div>
      </section>

      <BookServiceLinks />

      <Reviews />
      <Coupons city={city} />
      <Contact city={city} />
      <Footer city={city} />
      <LegacyTracking />

      <style dangerouslySetInnerHTML={{ __html: svhCss }} />
    </div>
  )
}

const svhCss = `
.svh-wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.svh-hero { background: #0d0913; color: #fff; padding: 120px 0 88px; }
.svh-eyebrow {
  margin: 0 0 12px; color: #b79bff; font-size: 13px; font-weight: 800;
  letter-spacing: .16em; text-transform: uppercase;
}
.svh-h1 {
  margin: 0 0 20px; max-width: 900px; font-size: clamp(34px,4.6vw,56px);
  line-height: 1.06; letter-spacing: -.03em;
}
.svh-lede { margin: 0 0 30px; max-width: 680px; color: #c8bfd6; font-size: 17px; line-height: 1.62; }
.svh-cta {
  display: inline-flex; align-items: center; padding: 15px 28px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,.3); color: #fff; text-decoration: none;
  font-size: 15px; font-weight: 700;
}
.svh-cta:hover { background: rgba(255,255,255,.08); }
@media (max-width: 760px) { .svh-hero { padding: 88px 0 56px; } }
`
