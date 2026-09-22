// V2's copy of the line that sits under each booking button (V1 has its own
// under components/ — the variants never share section components). It is a
// quiet reminder, not a badge: small, muted, and only claims the site already
// makes elsewhere (the BBB seal in the footer, "Insured & Bonded" in the CTA
// banners), so it can't drift out of step with them.
//
// The <style> carries an href and precedence so React hoists it once, however
// many CTAs on the page render this.
const css = `
.cta-trust {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 0;
  font-family: 'Inter Tight', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.62);
}
.cta-trust svg { flex-shrink: 0; color: #22c55e; }
.cta-trust-center { justify-content: center; }
.cta-trust-light { color: #6b5f80; }
.cta-trust-light svg { color: #16a34a; }
.cta-trust-flush { margin-top: 0; }
@media (max-width: 640px) {
  .cta-trust { justify-content: center; }
}
`

export default function CtaTrust({ tone = 'dark', align = 'start', flush = false }) {
  const className = [
    'cta-trust',
    align === 'center' && 'cta-trust-center',
    tone === 'light' && 'cta-trust-light',
    flush && 'cta-trust-flush',
  ].filter(Boolean).join(' ')

  return (
    <>
      <style href="cta-trust-v2" precedence="default">{css}</style>
      <p className={className}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        BBB Accredited · Insured &amp; Bonded
      </p>
    </>
  )
}
