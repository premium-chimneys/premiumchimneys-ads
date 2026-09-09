export const css = `
.cc-wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.cc-h1 { margin: 0 0 18px; font-size: clamp(34px,4.6vw,54px); line-height: 1.07; letter-spacing: -.03em; }
.cc-h2 { margin: 0 0 20px; font-size: clamp(26px,3.2vw,38px); line-height: 1.15; letter-spacing: -.02em; color: #20152d; }
.cc-eyebrow { margin: 0 0 12px; color: #b79bff; font-size: 13px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.cc-lede { margin: 0 0 28px; max-width: 720px; color: #6c6179; font-size: 16px; line-height: 1.6; }

.cc-hero { background: #0d0913; color: #fff; padding: 96px 0 88px; }
.cc-hero-grid { display: grid; grid-template-columns: 1.05fr .95fr; gap: 56px; align-items: center; }
.cc-hero-sub { margin: 0 0 30px; color: #c8bfd6; font-size: 17px; line-height: 1.62; }
.cc-hero-media img { width: 100%; height: auto; border-radius: 20px; display: block; }

.cc-ctas { display: flex; flex-wrap: wrap; gap: 12px; }
.cc-cta-primary { border: 0; border-radius: 999px; padding: 15px 28px; background: linear-gradient(135deg,#6f3fb0,#4f2481); color: #fff; font: inherit; font-size: 15px; font-weight: 800; cursor: pointer; }
.cc-cta-secondary { display: inline-flex; align-items: center; padding: 15px 28px; border-radius: 999px; border: 1px solid rgba(255,255,255,.3); color: #fff; text-decoration: none; font-size: 15px; font-weight: 700; }
.cc-closing .cc-cta-secondary { border-color: #d5c9e6; color: #3a2b4d; }

.cc-intro { background: #faf9fe; padding: 56px 0; }
.cc-intro p { max-width: 900px; margin: 0; color: #4b4157; font-size: 17px; line-height: 1.72; }

.cc-band { padding: 76px 0; background: #fff; }
.cc-band-alt { background: #faf9fe; }
.cc-closing { background: #f3eefb; padding: 76px 0; text-align: center; }
.cc-closing .cc-lede { margin-inline: auto; }
.cc-closing .cc-ctas { justify-content: center; }

.cc-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap: 18px; }
.cc-card { padding: 26px; border: 1px solid #e8e1f2; border-radius: 18px; background: #fff; }
.cc-card h3 { margin: 0 0 8px; font-size: 17px; font-weight: 800; color: #20152d; }
.cc-card p { margin: 0; color: #6c6179; font-size: 15px; line-height: 1.58; }

.cc-signs { display: grid; grid-template-columns: repeat(auto-fit,minmax(320px,1fr)); gap: 12px; }
.cc-sign { display: flex; gap: 12px; padding: 16px 18px; border: 1px solid #e8e1f2; border-radius: 14px; background: #fff; }
.cc-sign span { color: #6f3fb0; font-weight: 800; line-height: 1.5; }
.cc-sign p { margin: 0; color: #4b4157; font-size: 15px; line-height: 1.5; }

.cc-steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.cc-steps li { display: flex; gap: 18px; padding: 22px 24px; border: 1px solid #e8e1f2; border-radius: 16px; background: #fff; }
.cc-step-n { color: #cbb6f0; font-size: 22px; font-weight: 800; line-height: 1; }
.cc-steps h3 { margin: 0 0 6px; font-size: 17px; font-weight: 800; color: #20152d; }
.cc-steps p { margin: 0; color: #6c6179; font-size: 15px; line-height: 1.58; }

.cc-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px; }
.cc-chip { padding: 9px 16px; border-radius: 999px; background: #f1ecf8; color: #4f3373; font-size: 14px; font-weight: 700; cursor: default; }

.cc-related-row { padding-top: 28px; border-top: 1px solid #e8e1f2; }
.cc-related-title { margin: 0 0 14px; color: #20152d; font-size: 15px; font-weight: 800; }
.cc-related-links { display: flex; flex-wrap: wrap; gap: 10px; }
.cc-related-link { padding: 10px 18px; border: 1px solid #d9cdec; border-radius: 999px; color: #5b3a95; text-decoration: none; font-size: 14px; font-weight: 700; background: #fff; }
.cc-related-link:hover { background: #f4eeff; }

.cc-faqs { display: grid; gap: 10px; }
.cc-faq { border: 1px solid #e8e1f2; border-radius: 14px; background: #fff; padding: 18px 22px; }
.cc-faq summary { cursor: pointer; color: #20152d; font-size: 16px; font-weight: 800; }
.cc-faq p { margin: 12px 0 0; color: #6c6179; font-size: 15px; line-height: 1.6; }

@media (max-width: 900px) {
  .cc-hero { padding: 64px 0 56px; }
  .cc-hero-grid { grid-template-columns: 1fr; gap: 32px; }
  .cc-band, .cc-closing { padding: 52px 0; }
  .cc-steps li { flex-direction: column; gap: 10px; }
}
`
