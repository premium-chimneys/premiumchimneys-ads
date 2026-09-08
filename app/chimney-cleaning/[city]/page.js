import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCityData } from '@/lib/getCityData'
import AnnouncementBar from '@/components/AnnouncementBar'
import NavigationBar from '@/components/NavigationBar'
import Reviews from '@/components/Reviews'
import Coupons from '@/components/Coupons'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import LegacyTracking from '@/components/tracking/LegacyTracking'
import schema from '@/data/chimney-cleaning-flower-mound-tx-schema.json'
import { css } from './styles'
import {
  HERO_IMAGE, HERO_ALT, HERO_SUB, INTRO, INCLUDED,
  SIGNS, STEPS, REASONS, AREAS, FAQS, RELATED,
} from './content'

const CITY_SLUG = 'flower-mound-tx'
const PAGE_URL = 'https://book.premiumchimneys.com/chimney-cleaning/flower-mound-tx'

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
    title: 'Chimney Cleaning in Flower Mound, TX | Premium Chimneys',
    description:
      'Professional chimney cleaning and sweeping in Flower Mound, TX. Creosote and soot removal, clean containment, photo documentation. Call (469) 587-8303.',
    alternates: { canonical: PAGE_URL },
    openGraph: {
      title: 'Chimney Cleaning & Sweeping in Flower Mound, TX',
      description:
        'Certified chimney sweeping for Flower Mound homes. We remove creosote and soot, protect your floors, and document what we find.',
      url: PAGE_URL,
      type: 'website',
      siteName: 'Premium Chimneys',
    },
    other: { 'pv-depth': 'service-v1' },
  }
}

export default async function Page({ params }) {
  const { city: citySlug } = await params
  if (citySlug !== CITY_SLUG) notFound()

  const city = await getCityData(citySlug)
  if (!city) notFound()

  return (
    <div data-variant="v1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AnnouncementBar city={city} offersMembership={city.metroplex === 'dfw'} />
      <NavigationBar city={city} />

      <section className="cc-hero">
        <div className="cc-wrap cc-hero-grid">
          <div>
            <p className="cc-eyebrow">Chimney Cleaning</p>
            <h1 className="cc-h1">Chimney Cleaning in Flower Mound, TX</h1>
            <p className="cc-hero-sub">{HERO_SUB}</p>
            <div className="cc-ctas">
              <button type="button" className="cc-cta-primary">Book Your Chimney Cleaning</button>
              <a href={`tel:${city.phone}`} className="cc-cta-secondary">Call (469) 587-8303</a>
            </div>
          </div>
          <div className="cc-hero-media">
            <Image src={HERO_IMAGE} alt={HERO_ALT} width={760} height={560} priority unoptimized />
          </div>
        </div>
      </section>

      <section className="cc-intro"><div className="cc-wrap"><p>{INTRO}</p></div></section>

      <section className="cc-band">
        <div className="cc-wrap">
          <h2 className="cc-h2">What&apos;s included in a Premium Chimneys sweep</h2>
          <div className="cc-grid">
            {INCLUDED.map(([t, b]) => (
              <div className="cc-card" key={t}>
                <h3>{t}</h3><p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cc-band cc-band-alt">
        <div className="cc-wrap">
          <h2 className="cc-h2">When your chimney needs cleaning</h2>
          <p className="cc-lede">Once a year before the season for most homes, and more often if you burn wood heavily. These are the signs it is overdue.</p>
          <div className="cc-signs">
            {SIGNS.map((s) => <div className="cc-sign" key={s}><span aria-hidden="true">•</span><p>{s}</p></div>)}
          </div>
        </div>
      </section>

      <section className="cc-band">
        <div className="cc-wrap">
          <h2 className="cc-h2">How our chimney cleaning works</h2>
          <ol className="cc-steps">
            {STEPS.map(([t, b], i) => (
              <li key={t}><span className="cc-step-n">{String(i + 1).padStart(2, '0')}</span><div><h3>{t}</h3><p>{b}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cc-band cc-band-alt">
        <div className="cc-wrap">
          <h2 className="cc-h2">Why Flower Mound homeowners call us</h2>
          <div className="cc-grid">
            {REASONS.map(([t, b]) => (<div className="cc-card" key={t}><h3>{t}</h3><p>{b}</p></div>))}
          </div>
        </div>
      </section>

      <section className="cc-band">
        <div className="cc-wrap">
          <h2 className="cc-h2">Chimney cleaning across Flower Mound</h2>
          <p className="cc-lede">We work throughout Flower Mound and the surrounding neighborhoods.</p>
          <div className="cc-chips">{AREAS.map((a) => <span className="cc-chip" key={a}>{a}</span>)}</div>
          <div className="cc-related-row">
            <p className="cc-related-title">Explore Flower Mound services</p>
            <div className="cc-related-links">
              {RELATED.map(([n, h]) => <Link key={h} href={h} className="cc-related-link">{n}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <section className="cc-band cc-band-alt">
        <div className="cc-wrap">
          <h2 className="cc-h2">Chimney cleaning questions, answered</h2>
          <div className="cc-faqs">
            {FAQS.map(([q, a]) => (
              <details className="cc-faq" key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="cc-closing">
        <div className="cc-wrap">
          <h2 className="cc-h2">Get your chimney swept before you light the first fire</h2>
          <p className="cc-lede">Fireplace season fills our calendar fast. Book now and go into the cold months knowing your system is clear, safe, and documented.</p>
          <div className="cc-ctas">
            <button type="button" className="cc-cta-primary">Book Your Chimney Cleaning</button>
            <a href={`tel:${city.phone}`} className="cc-cta-secondary">Call (469) 587-8303</a>
          </div>
        </div>
      </section>

      <Reviews />
      <Coupons city={city} />
      <Contact city={city} />
      <Footer city={city} />
      <LegacyTracking />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </div>
  )
}
