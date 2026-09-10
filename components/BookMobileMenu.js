'use client'

import { useEffect, useState } from 'react'
import { BOOK_SERVICES, BOOK_CITY } from '@/components/BookServiceLinks'

// Flower Mound only, mounted by NavigationBar. The desktop bar hides its
// Services item under 760px and there is no other way into the service pages
// on a phone, so this is that way in.
export default function BookMobileMenu({ city }) {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className="bmm-trigger"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span /><span /><span />
      </button>

      {open && (
        <div className="bmm-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="bmm-panel" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="bmm-head">
              <span className="bmm-title">Menu</span>
              <button type="button" className="bmm-close" aria-label="Close menu" onClick={() => setOpen(false)}>&times;</button>
            </div>

            <button
              type="button"
              className="bmm-row"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
            >
              Services
              <svg className={servicesOpen ? 'bmm-caret bmm-caret-open' : 'bmm-caret'} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>

            {servicesOpen && (
              <div className="bmm-sub">
                <a href={`/services/${BOOK_CITY}`} className="bmm-sub-all" onClick={() => setOpen(false)}>All services</a>
                {BOOK_SERVICES.map(([slug, name]) => (
                  <a key={slug} href={`/${slug}/${BOOK_CITY}`} className="bmm-sub-item" onClick={() => setOpen(false)}>{name}</a>
                ))}
              </div>
            )}

            <a href={`tel:${city?.phone}`} className="bmm-phone">{city?.phone_text}</a>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: bmmCss }} />
    </>
  )
}

const bmmCss = `
.bmm-trigger {
  display: none; flex-direction: column; justify-content: center; gap: 5px;
  width: 42px; height: 42px; padding: 0 10px; margin-left: 12px;
  border: 1px solid #e3dcef; border-radius: 11px; background: #fff; cursor: pointer;
}
.bmm-trigger span { display: block; height: 2px; width: 100%; border-radius: 2px; background: #2a1f3d; }
.bmm-overlay {
  position: fixed; inset: 0; z-index: 100000; background: rgba(16,10,26,.55);
  backdrop-filter: blur(4px); display: flex; justify-content: flex-end;
}
.bmm-panel {
  width: min(86vw, 340px); height: 100%; overflow-y: auto; padding: 20px;
  background: #fff; box-shadow: -20px 0 60px rgba(0,0,0,.28);
  font-family: 'Inter Tight', sans-serif;
  animation: bmmIn .2s ease;
}
@keyframes bmmIn { from { transform: translateX(24px); opacity: .6; } to { transform: none; opacity: 1; } }
.bmm-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.bmm-title { color: #7651ab; font-size: 12px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.bmm-close { border: 0; background: transparent; color: #6c6179; font-size: 30px; line-height: 1; cursor: pointer; }
.bmm-row {
  display: flex; align-items: center; justify-content: space-between; width: 100%;
  padding: 15px 14px; border: 1px solid #e8e1f2; border-radius: 12px; background: #faf9fe;
  color: #20152d; font: inherit; font-size: 16px; font-weight: 800; cursor: pointer;
}
.bmm-caret { transition: transform .2s ease; flex-shrink: 0; }
.bmm-caret-open { transform: rotate(180deg); }
.bmm-sub { display: grid; gap: 2px; margin: 8px 0 0; padding: 6px; border: 1px solid #eee7f6; border-radius: 12px; }
.bmm-sub-all {
  display: block; padding: 12px 13px; border-radius: 9px; background: #f4eeff;
  color: #5b3a95; text-decoration: none; font-size: 14px; font-weight: 800; margin-bottom: 2px;
}
.bmm-sub-item {
  display: block; padding: 12px 13px; border-radius: 9px;
  color: #3a2b4d; text-decoration: none; font-size: 14px; font-weight: 600;
}
.bmm-sub-item:active, .bmm-sub-item:hover { background: #f7f3fd; }
.bmm-phone {
  display: block; margin-top: 18px; padding: 14px; border-radius: 999px;
  background: linear-gradient(135deg,#6f3fb0,#4f2481); color: #fff;
  text-align: center; text-decoration: none; font-size: 15px; font-weight: 800;
}
@media (max-width: 760px) { .bmm-trigger { display: flex; } }
`
