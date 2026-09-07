// Per-service project photos for the "Our work" carousel that sits directly
// under the hero on both landing variants.
//
// Supabase is the source of truth — see sql/service_gallery.sql. What lives
// here is the fallback used for a service with no rows yet, so the section
// renders before the table is populated and never disappears if a slug is
// added to the site ahead of its photographs. Both variants read from this
// file, so V1 and V2 always show the same work; the A/B test is about layout,
// not about which jobs we show.
//
// The photos sit in the landing-v2 bucket the heroes already come from, so the
// carousel reuses the connection ServiceHero has already opened (and warmed
// with a preconnect) rather than opening a second origin.

const BUCKET = 'https://labekmkkpbgrxfpcsyvz.supabase.co/storage/v1/object/public/landing-v2/gallery'

const P = {
  sweepRoof:      `${BUCKET}/chimney-sweep-roof-brush-flue-cleaning-920.webp`,
  flueEval:       `${BUCKET}/chimney-inspection-roofline-flue-evaluation-920.webp`,
  techInspect:    `${BUCKET}/premium-chimneys-certified-chimney-technician-fireplace-inspection-920.webp`,
  hepaSoot:       `${BUCKET}/fireplace-cleaning-hepa-vacuum-soot-removal-920.webp`,
  capMetalRoof:   `${BUCKET}/chimney-cap-installation-metal-roof-920.webp`,
  capCustom:      `${BUCKET}/custom-chimney-cap-installation-920.webp`,
  flashing:       `${BUCKET}/chimney-repair-flashing-masonry-restoration-920.webp`,
  rebuild:        `${BUCKET}/chimney-rebuild-before-after-920.webp`,
  siding:         `${BUCKET}/chimney-siding-replacement-before-after-920.webp`,
  fireboxRebuilt: `${BUCKET}/firebox-repair-before-after-920.webp`,
  fireboxDamage:  `${BUCKET}/fireplace-repair-firebox-masonry-damage-920.webp`,
  woodStove:      `${BUCKET}/fireplace-inspection-wood-stove-firebox-check-920.webp`,
  maintenance:    `${BUCKET}/fireplace-maintenance-safe-home-use-920.webp`,
  gasBurner:      `${BUCKET}/gas-fireplace-repair-burner-flame-performance-920.webp`,
  gasLogs:        `${BUCKET}/gas-fireplace-installation-modern-920.webp`,
  fireballs:      `${BUCKET}/gas-fireballs-installation-920.webp`,

  // Shot on site. Named for what is in the frame rather than the gallery they
  // first appeared in, so any service can reuse them with its own caption.
  herringboneLogs:    `${BUCKET}/gas-logs-burning-herringbone-firebox-920.webp`,
  burnerBeforeAfter:  `${BUCKET}/masonry-firebox-gas-burner-before-after-920.webp`,
  logSetBeforeAfter:  `${BUCKET}/gas-log-set-installation-before-after-920.webp`,
  breastResurfaced:   `${BUCKET}/chimney-breast-resurfaced-before-after-920.webp`,
  eveningFire:        `${BUCKET}/painted-brick-fireplace-evening-fire-920.webp`,
  blueFireGlass:      `${BUCKET}/plaster-fireplace-blue-fire-glass-920.webp`,
  blackFireboxLogs:   `${BUCKET}/gas-logs-in-black-painted-firebox-920.webp`,
  chaseTrimCrown:     `${BUCKET}/chase-siding-trim-and-crown-replaced-before-after-920.webp`,
  hipCapSwap:         `${BUCKET}/round-vent-cap-replaced-with-hip-cap-before-after-920.webp`,
  peelingChase:       `${BUCKET}/peeling-chase-resided-with-tan-cap-before-after-920.webp`,
  sageChase:          `${BUCKET}/sage-chase-resided-with-black-cap-before-after-920.webp`,
  brickCrown:         `${BUCKET}/crumbling-brick-crown-rebuilt-before-after-920.webp`,
  twoCapsMetalRoof:   `${BUCKET}/two-hip-caps-on-a-metal-roof-920.webp`,
  capInstallTech:     `${BUCKET}/technician-beside-black-hip-cap-tile-roof-920.webp`,
  capAtSunset:        `${BUCKET}/stucco-chimney-brown-hip-cap-at-sunset-920.webp`,
  estateRoofline:     `${BUCKET}/estate-roofline-with-two-stucco-chimneys-920.webp`,
  brownCapRedBrick:   `${BUCKET}/custom-brown-hip-cap-on-red-brick-920.webp`,
  brickRebuilt:       `${BUCKET}/brick-chimney-rebuilt-with-black-cap-before-after-920.webp`,
  brickCrackRepair:   `${BUCKET}/painted-brick-chimney-crack-repair-before-after-920.webp`,
}

// These eight originals were already narrower than the phone slot, so there is
// no 640w sibling to serve and the card gets the one file at whatever size the
// source had. They are the outstanding content job: at 484x300 (and one at
// 400x400) they will look soft on a retina screen. Everything else is sharp.
const NO_SMALL = new Set([
  'premium-chimneys-certified-chimney-technician-fireplace-inspection',
  'fireplace-cleaning-hepa-vacuum-soot-removal',
  'custom-chimney-cap-installation',
  'chimney-rebuild-before-after',
  'chimney-siding-replacement-before-after',
  'firebox-repair-before-after',
  'gas-fireplace-installation-modern',
  'gas-fireballs-installation',
])

function smallFor(img) {
  const stem = img.split('/').pop().replace('-920.webp', '')
  return NO_SMALL.has(stem) ? null : img.replace('-920.webp', '-640.webp')
}

// A slide carries three pieces of context and nothing more:
//   scope  — where on the system the work happened (chip over the photo)
//   title  — what we actually did (heading under the photo)
//   result — the outcome the homeowner got
// Deliberately no timeline. A real one is honest but reads as a warning on a
// page whose job is to get the call booked, and "4 days" beside a photo tells
// a homeowner nothing about their own chimney.
const GALLERIES = {
  'chimney-sweep': [
    { img: P.burnerBeforeAfter,  scope: 'Interior · Firebox',        title: 'Soot and creosote cleared out',          result: 'Flue and firebox clean',    alt: 'Masonry firebox before and after a deep clean' },
    { img: P.herringboneLogs,    scope: 'Interior · Firebox',        title: 'Swept and test-fired',                   result: 'Draft pulling right',       alt: 'Gas log set burning in a herringbone firebox' },
    { img: P.blackFireboxLogs,   scope: 'Interior · Log set',        title: 'Logs lifted, firebox vacuumed out',      result: 'No dust indoors',           alt: 'Clean gas log set in a black painted firebox' },
    { img: P.blueFireGlass,      scope: 'Interior · Media',          title: 'Ash cleared from the media bed',         result: 'Burning clean',             alt: 'Blue fire glass burning in a white plaster fireplace' },
    { img: P.eveningFire,        scope: 'Interior · Handover',       title: 'Left ready to light',                    result: 'Safe to use nightly',       alt: 'Painted brick fireplace lit in the evening' },
  ],

  'chimney-inspection': [
    { img: P.brickCrown,         scope: 'Exterior · Crown',          title: 'Deteriorating crown found at the top',   result: 'Rebuilt and capped',        alt: 'Crumbling brick chimney crown before and after being rebuilt' },
    { img: P.chaseTrimCrown,     scope: 'Exterior · Chase',          title: 'Rotting wood found all around chase',    result: 'Rebuilt and sealed',        alt: 'Chimney chase trim and crown before and after replacement' },
    { img: P.hipCapSwap,         scope: 'Exterior · Cap',            title: 'Worn cap flagged from the roof',         result: 'Replaced same week',        alt: 'Round vent cap before and after replacement with a hip cap' },
    { img: P.peelingChase,       scope: 'Exterior · Flashing',       title: 'Completely weathered chimney',           result: 'Watertight again',          alt: 'Weathered chimney chase before and after being re-sided' },
    { img: P.sageChase,          scope: 'Exterior · Structure',      title: 'Failing paint hiding rotted board',      result: 'Caught before it spread',   alt: 'Chimney chase with failing paint before and after re-siding' },
  ],

  'chimney-repair': [
    { img: P.brickCrown,         scope: 'Exterior · Crown',          title: 'Deteriorating crown found at the top',   result: 'Structurally sound',        alt: 'Crumbling brick chimney crown before and after being rebuilt' },
    { img: P.chaseTrimCrown,     scope: 'Exterior · Chase',          title: 'Rotting wood found all over chase',      result: 'Rebuilt and sealed',        alt: 'Chimney chase trim and crown before and after replacement' },
    { img: P.brickCrackRepair,   scope: 'Exterior · Brickwork',      title: 'Cracked stack repaired and refinished',  result: 'Straight and sealed',       alt: 'Painted brick chimney before and after crack repair and refinishing' },
    { img: P.brickRebuilt,       scope: 'Exterior · Brickwork',      title: 'Spalling brick rebuilt and re-capped',   result: 'Solid again',               alt: 'Brick chimney before and after being rebuilt with a new black cap' },
    { img: P.hipCapSwap,         scope: 'Exterior · Cap',            title: 'Old and rusted chase cover',             result: 'Custom chimney cap',        alt: 'Round vent cap before and after replacement with a hip cap' },
  ],

  'chimney-caps': [
    { img: P.twoCapsMetalRoof,   scope: 'Exterior · Multi-flue',     title: 'Dual custom chimney caps',               result: 'Perfect fit',               alt: 'Two hip caps installed on chimneys above a metal roof' },
    { img: P.capInstallTech,     scope: 'Exterior · Install',        title: 'Custom pitched roof chimney cap',        result: 'Installed with precision',  alt: 'Technician beside a newly installed black hip cap' },
    { img: P.capAtSunset,        scope: 'Exterior · Finish',         title: 'Cap colour matched to the trim',         result: 'Blends with the roof',      alt: 'Stucco chimney with a brown hip cap at sunset' },
    { img: P.estateRoofline,     scope: 'Exterior · Whole home',     title: 'Both chimneys capped in one visit',      result: 'Animal entry prevention',   alt: 'Estate roofline with two capped stucco chimneys' },
    { img: P.brownCapRedBrick,   scope: 'Exterior · Custom cap',     title: 'Custom masonry chimney cap',             result: 'Screened against debris',   alt: 'Custom brown hip cap with mesh screen on a red brick chimney' },
  ],

  'fireplace-inspection': [
    { img: P.herringboneLogs,    scope: 'Interior · Gas logs',       title: 'Gas log set running at full flame',      result: 'Even, steady burn',         alt: 'Gas log set burning in a herringbone firebox' },
    { img: P.burnerBeforeAfter,  scope: 'Interior · Firebox',        title: 'Firebox cleaned up and burner replaced', result: 'Even flame',                alt: 'Masonry firebox before and after a new gas burner was fitted' },
    { img: P.logSetBeforeAfter,  scope: 'Interior · Gas logs',       title: 'Gas log system replacement',             result: 'Finally lighting properly', alt: 'Gas log set installation, before and after' },
    { img: P.breastResurfaced,   scope: 'Interior · Chimney breast', title: 'Complete fireplace remodel',             result: 'New aesthetic',             alt: 'Stone chimney breast before and after being resurfaced' },
    { img: P.eveningFire,        scope: 'Interior · Full system',    title: 'Back in service for the season',         result: 'Safe to use nightly',       alt: 'Painted brick fireplace lit in the evening' },
  ],

  'fireplace-cleaning': [
    { img: P.burnerBeforeAfter,  scope: 'Interior · Firebox',        title: 'Years of soot cleared out',              result: 'Like new again',            alt: 'Masonry firebox before and after a deep clean' },
    { img: P.blueFireGlass,      scope: 'Interior · Fire glass',     title: 'Fire glass washed and relaid',           result: 'Sparkling again',           alt: 'Blue fire glass burning in a white plaster fireplace' },
    { img: P.blackFireboxLogs,   scope: 'Interior · Log set',        title: 'Logs lifted, firebox vacuumed out',      result: 'No dust indoors',           alt: 'Clean gas log set in a black painted firebox' },
    { img: P.herringboneLogs,    scope: 'Interior · Gas logs',       title: 'Media rinsed and logs reset',            result: 'Even, steady burn',         alt: 'Gas log set burning in a herringbone firebox' },
    { img: P.eveningFire,        scope: 'Interior · Full system',    title: 'Left clean and ready to light',          result: 'Safe to use nightly',       alt: 'Painted brick fireplace lit in the evening' },
  ],

  'fireplace-repair': [
    { img: P.burnerBeforeAfter,  scope: 'Interior · Firebox',        title: 'Firebox repaired and burner replaced',   result: 'Burning clean again',       alt: 'Masonry firebox before and after a new gas burner was fitted' },
    { img: P.breastResurfaced,   scope: 'Interior · Chimney breast', title: 'Complete rebuild',                       result: 'Whole wall renewed',        alt: 'Stone chimney breast before and after being resurfaced' },
    { img: P.logSetBeforeAfter,  scope: 'Interior · Gas logs',       title: 'Failed burner replacement',              result: 'Finally lighting properly', alt: 'Gas log set replacement, before and after' },
    { img: P.herringboneLogs,    scope: 'Interior · Gas logs',       title: 'Log set rebuilt and re-lit',             result: 'Even, steady burn',         alt: 'Gas log set burning in a herringbone firebox' },
    { img: P.eveningFire,        scope: 'Interior · Full system',    title: 'Back in service the same week',          result: 'Safe to use nightly',       alt: 'Painted brick fireplace lit in the evening' },
  ],

  'fireplace-maintenance': [
    { img: P.herringboneLogs,    scope: 'Interior · Gas logs',       title: 'Log set serviced and test-fired',        result: 'Even, steady burn',         alt: 'Gas log set burning in a herringbone firebox' },
    { img: P.burnerBeforeAfter,  scope: 'Interior · Firebox',        title: 'Firebox cleaned and burner serviced',    result: 'Burning clean again',       alt: 'Masonry firebox before and after servicing' },
    { img: P.logSetBeforeAfter,  scope: 'Interior · Gas logs',       title: 'Faulty burner replaced',                 result: 'Finally lighting properly', alt: 'Gas log set replacement, before and after' },
    { img: P.blueFireGlass,      scope: 'Interior · Media',          title: 'Glass cleaned and burner ports cleaned', result: 'Efficiency restored',       alt: 'Blue fire glass burning in a white plaster fireplace' },
    { img: P.eveningFire,        scope: 'Interior · Full system',    title: 'Ready before the first cold night',      result: 'Safe to use nightly',       alt: 'Painted brick fireplace lit in the evening' },
  ],

  'gas-fireplace-repair': [
    { img: P.herringboneLogs,    scope: 'Interior · Gas logs',       title: 'Flame back to full height',              result: 'Even, steady burn',         alt: 'Gas log set burning in a herringbone firebox' },
    { img: P.burnerBeforeAfter,  scope: 'Interior · Burner',         title: 'Gas pipe replacement',                   result: 'Burning clean again',       alt: 'Masonry firebox before and after a new gas burner was fitted' },
    { img: P.logSetBeforeAfter,  scope: 'Interior · Gas logs',       title: 'Old burner out, new log set in',         result: 'Lights first time',         alt: 'Gas log set installation, before and after' },
    { img: P.blackFireboxLogs,   scope: 'Interior · Log set',        title: 'Log set replacement',                    result: 'Even flame path',           alt: 'Clean gas log set in a black painted firebox' },
    { img: P.blueFireGlass,      scope: 'Interior · Media',          title: 'Relit and leak-tested',                  result: 'Safe to use nightly',       alt: 'Blue fire glass burning in a white plaster fireplace' },
  ],
}

// Anything without its own set — a new slug, or the air-duct brand reaching
// this route — still gets a coherent gallery rather than an empty section.
const DEFAULT_GALLERY = [
  { img: P.techInspect,     scope: 'Interior · Full system',   title: 'Certified technician walkthrough',      result: '22 points checked',   alt: 'Certified technician inspecting a fireplace' },
  { img: P.sweepRoof,       scope: 'Exterior · Flue',          title: 'Full flue brush-out from the roof',     result: 'Creosote removed',    alt: 'Technician brushing a chimney flue from the roof' },
  { img: P.flashing,        scope: 'Exterior · Flashing',      title: 'Flashing and masonry restoration',      result: 'Leak sealed',         alt: 'Restored chimney flashing and masonry' },
  { img: P.fireboxRebuilt,  scope: 'Interior · Firebox',       title: 'Firebox relaid in high-heat brick',     result: 'Fully rebuilt',       alt: 'Firebox before and after masonry repair' },
  { img: P.capCustom,       scope: 'Exterior · Cap',           title: 'Custom cap built to measure',           result: 'Water kept out',      alt: 'Custom chimney cap installation' },
]

// `rows` is services.service_gallery, embedded by getServiceData. When the
// table has rows for this service they win outright — no merging with the
// built-ins, so deleting a slide in Supabase actually deletes it rather than
// uncovering an older one.
export function getServiceGallery(slug, rows) {
  if (Array.isArray(rows) && rows.length) {
    return [...rows]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((r) => ({
        img: r.image_url,
        small: r.image_url_small || null,
        scope: r.scope,
        title: r.title,
        result: r.result,
        alt: r.alt,
      }))
  }
  return (GALLERIES[slug] || DEFAULT_GALLERY).map((s) => ({ ...s, small: smallFor(s.img) }))
}
