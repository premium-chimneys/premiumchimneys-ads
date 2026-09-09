import Link from 'next/link'

// The seven Flower Mound service pages, in the order the client approved.
//
// Flower Mound only. These paths are hardcoded to that city because
// /chimney-cleaning exists for it alone — pointing the other 453 cities at
// this list would send them to a 404 and to six pages about the wrong place.
export const BOOK_CITY = 'flower-mound-tx'

export const BOOK_SERVICES = [
  ['chimney-repair', 'Chimney Repair', 'Crowns, masonry, flue liners, flashing and leaks'],
  ['fireplace-repair', 'Fireplace Repair', 'Fireboxes, dampers, refractory panels and blowers'],
  ['chimney-cleaning', 'Chimney Cleaning', 'Creosote and soot removal with a condition report'],
  ['gas-fireplace-repair', 'Gas Fireplace Repair', 'Pilots, thermocouples, valves and ignition'],
  ['fireplace-inspection', 'Fireplace Inspection', 'A full check of the firebox, damper and surround'],
  ['fireplace-cleaning', 'Fireplace Cleaning', 'Soot and buildup cleared, floors protected'],
  ['fireplace-maintenance', 'Fireplace Maintenance', 'Seasonal care that keeps the system running'],
]

export default function BookServiceLinks({ currentService }) {
  const others = BOOK_SERVICES.filter(([slug]) => slug !== currentService)

  return (
    <section className="bsl-section">
      <div className="bsl-wrap">
        <p className="bsl-eyebrow">Our Services</p>
        <h2 className="bsl-h2">More chimney and fireplace work in Flower Mound</h2>
        <div className="bsl-grid">
          {others.map(([slug, name, blurb]) => (
            <Link key={slug} href={`/${slug}/${BOOK_CITY}`} className="bsl-card">
              <span className="bsl-name">{name}</span>
              <span className="bsl-blurb">{blurb}</span>
              <span className="bsl-go">
                View service
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: bslCss }} />
    </section>
  )
}

const bslCss = `
.bsl-section { background: #faf9fe; padding: 76px 0; }
.bsl-wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.bsl-eyebrow {
  margin: 0 0 10px; color: #7651ab; font-size: 12px; font-weight: 800;
  letter-spacing: .16em; text-transform: uppercase;
}
.bsl-h2 {
  margin: 0 0 28px; color: #20152d; font-size: clamp(26px,3.2vw,36px);
  line-height: 1.15; letter-spacing: -.02em;
}
.bsl-grid {
  display: grid; grid-template-columns: repeat(auto-fit,minmax(290px,1fr)); gap: 16px;
}
.bsl-card {
  display: flex; flex-direction: column; gap: 8px; padding: 24px;
  border: 1px solid #e8e1f2; border-radius: 16px; background: #fff;
  text-decoration: none; color: inherit;
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}
.bsl-card:hover {
  transform: translateY(-2px); border-color: #cbb6f0;
  box-shadow: 0 16px 36px rgba(79,36,129,.12);
}
.bsl-name { color: #20152d; font-size: 18px; font-weight: 800; letter-spacing: -.01em; }
.bsl-blurb { color: #6c6179; font-size: 14px; line-height: 1.55; }
.bsl-go {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 4px;
  color: #6f3fb0; font-size: 14px; font-weight: 800;
}
@media (max-width: 760px) {
  .bsl-section { padding: 52px 0; }
  .bsl-card { padding: 20px; }
}
`
