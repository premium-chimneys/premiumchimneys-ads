'use client'

import { useEffect, useRef } from 'react'

const formCss = `
.hero-form-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 80px rgba(124, 58, 237, 0.08);
  font-family: 'Inter Tight', sans-serif;
  box-sizing: border-box;
}

.hero-form-card *, .hero-form-card *::before, .hero-form-card *::after { box-sizing: border-box; }

.hero-form-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #7c3aed, #a78bfa, #c084fc, #e879f9, #c084fc, #a78bfa, #7c3aed);
  background-size: 300% 100%;
  animation: auroraSlide 4s ease-in-out infinite;
  z-index: 5;
}

@keyframes auroraSlide {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-form-card::after {
  content: '';
  position: absolute;
  top: 0; left: 15%; right: 15%;
  height: 1px;
  background: transparent;
  box-shadow: 0 0 30px 8px rgba(124, 58, 237, 0.08);
  pointer-events: none;
  z-index: 0;
  animation: glowPulse 4s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; }
  50%      { opacity: 1; }
}

.hero-form-top { padding: 24px 28px 0; position: relative; }

.hero-form-title {
  font-family: 'Inter Tight', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #1a1225;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}

.hero-form-subtitle {
  font-family: 'Inter Tight', sans-serif;
  font-size: 13.5px;
  font-weight: 400;
  color: #7c6f94;
  margin: 0;
  line-height: 1.5;
}

.hero-form-dispatch {
  position: absolute;
  top: 24px;
  right: 28px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.22);
  border-radius: 999px;
}

.hero-form-dispatch-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #16a34a;
  flex-shrink: 0;
  position: relative;
}

.hero-form-dispatch-dot::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: rgba(22, 163, 74, 0.4);
  animation: livePing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes livePing {
  0%   { transform: scale(1); opacity: 0.7; }
  75%, 100% { transform: scale(2.2); opacity: 0; }
}

.hero-form-dispatch-text {
  font-family: 'Inter Tight', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #16a34a;
  letter-spacing: 0.02em;
}

.hero-form-body { padding: 20px 28px 28px; }

.hero-form-group { margin-bottom: 10px; position: relative; }

.hero-form-input,
.hero-form-textarea {
  width: 100%;
  font-family: 'Inter Tight', sans-serif;
  font-size: 14px;
  font-weight: 400;
  padding: 12px 16px;
  border: 1.5px solid rgba(124, 58, 237, 0.12);
  border-radius: 12px;
  background: #f8f6fd;
  color: #1a1225;
  outline: none;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.hero-form-input::placeholder,
.hero-form-textarea::placeholder { color: #b0a4c4; }

.hero-form-input:focus,
.hero-form-textarea:focus {
  border-color: #7c3aed;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1), 0 0 20px rgba(124, 58, 237, 0.04);
}

.hero-form-textarea { resize: none; min-height: 80px; }

/* Phone input with +1 prefix */
.hero-form-phone-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid rgba(124, 58, 237, 0.12);
  border-radius: 12px;
  background: #f8f6fd;
  overflow: hidden;
  transition: all 0.25s ease;
}
.hero-form-phone-wrap:focus-within {
  border-color: #7c3aed;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1), 0 0 20px rgba(124, 58, 237, 0.04);
}
.hero-form-phone-prefix {
  padding: 12px 0 12px 16px;
  font-family: 'Inter Tight', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1a1225;
  user-select: none;
  flex-shrink: 0;
  display: none;
}
.hero-form-phone-wrap.active .hero-form-phone-prefix { display: block; }
.hero-form-phone-input {
  flex: 1;
  font-family: 'Inter Tight', sans-serif;
  font-size: 14px;
  font-weight: 400;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #1a1225;
  outline: none;
}
.hero-form-phone-wrap.active .hero-form-phone-input { padding-left: 6px; }
.hero-form-phone-input::placeholder { color: #b0a4c4; }
.hero-form-phone-error {
  font-size: 11px;
  color: #ef4444;
  margin-top: 4px;
  display: none;
}
.hero-form-phone-error.visible { display: block; }

.hero-form-submit {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Inter Tight', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(160deg, #9b5de5 0%, #7c3aed 40%, #6d28d9 100%);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  margin-top: 6px;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
}

.hero-form-submit::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
  transform: skewX(-15deg);
  pointer-events: none;
  transition: left 0.6s ease;
}

.hero-form-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.5);
}

.hero-form-submit:hover::before { left: 140%; }
.hero-form-submit:active { transform: translateY(0); }
.hero-form-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.hero-form-submit svg { position: relative; z-index: 1; }

.hero-form-disclaimer {
  font-family: 'Inter Tight', sans-serif;
  font-size: 11px;
  color: #a099b2;
  margin-top: 14px;
  line-height: 1.5;
  text-align: center;
}

.hero-form-trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.hero-form-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Inter Tight', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #6b5c8a;
}

.hero-form-success {
  text-align: center;
  padding: 56px 28px;
  animation: heroFormSuccessFadeIn 0.6s ease-out both;
  display: none;
}

.hero-form-card.submitted .hero-form-success { display: block; }
.hero-form-card.submitted .hero-form-top,
.hero-form-card.submitted .hero-form-dispatch,
.hero-form-card.submitted .hero-form-body { display: none; }

@keyframes heroFormSuccessFadeIn {
  0%   { opacity: 0; transform: scale(0.92) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.hero-form-success-ring {
  width: 80px; height: 80px; border-radius: 50%;
  margin: 0 auto 24px; position: relative;
  display: flex; align-items: center; justify-content: center;
}

.hero-form-success-ring::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(34,197,94,0.3), rgba(34,197,94,0.05), rgba(34,197,94,0.3));
  animation: heroFormRingRotate 3s linear infinite;
}

@keyframes heroFormRingRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.hero-form-success-circle {
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(145deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04));
  border: 1.5px solid rgba(34, 197, 94, 0.25);
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1;
  box-shadow: 0 0 32px rgba(34, 197, 94, 0.12);
}

.hero-form-success-circle svg { animation: heroFormCheckDraw 0.5s ease-out 0.3s both; }

@keyframes heroFormCheckDraw {
  0%   { opacity: 0; transform: scale(0.5); }
  50%  { opacity: 1; transform: scale(1.15); }
  100% { opacity: 1; transform: scale(1); }
}

.hero-form-success h3 {
  font-family: 'Inter Tight', sans-serif; font-size: 20px; font-weight: 700;
  color: #1a1225; margin: 0 0 10px; letter-spacing: -0.02em;
  animation: heroFormTextSlideUp 0.5s ease-out 0.4s both;
}

.hero-form-success p {
  font-family: 'Inter Tight', sans-serif; font-size: 14px; color: #7c6f94;
  margin: 0 auto; line-height: 1.6; max-width: 280px;
  animation: heroFormTextSlideUp 0.5s ease-out 0.55s both;
}

@keyframes heroFormTextSlideUp {
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .hero-form-top { padding: 20px 20px 0; }
  .hero-form-dispatch { top: 20px; right: 20px; }
  .hero-form-body { padding: 16px 20px 24px; }
  .hero-form-trust { flex-wrap: wrap; gap: 10px; }
}
`

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function getDigits(value) {
  return value.replace(/\D/g, '')
}

export default function Form() {
  const cardRef = useRef(null)
  const formRef = useRef(null)
  const phoneRef = useRef(null)
  const phoneErrorRef = useRef(null)
  const urlRef = useRef(null)

  useEffect(() => {
    if (urlRef.current) urlRef.current.value = window.location.href

    const form = formRef.current
    const card = cardRef.current
    const phoneInput = phoneRef.current
    const phoneError = phoneErrorRef.current
    if (!form || !card) return

    const submitSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="flex-shrink:0"><path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

    const phoneWrap = phoneInput?.parentElement

    const onPhoneInput = () => {
      phoneInput.value = formatPhone(phoneInput.value)
      const digits = getDigits(phoneInput.value)
      if (digits.length === 10) {
        phoneError.classList.remove('visible')
      }
    }

    const onPhoneFocus = () => { if (phoneWrap) phoneWrap.classList.add('active') }
    const onPhoneBlur = () => {
      if (phoneWrap && !getDigits(phoneInput.value).length) phoneWrap.classList.remove('active')
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', onPhoneInput)
      phoneInput.addEventListener('focus', onPhoneFocus)
      phoneInput.addEventListener('blur', onPhoneBlur)
    }

    const handler = (e) => {
      e.preventDefault()

      const digits = getDigits(phoneInput?.value || '')
      if (digits.length !== 10) {
        if (phoneError) phoneError.classList.add('visible')
        phoneInput?.focus()
        return
      }
      if (phoneError) phoneError.classList.remove('visible')

      const btn = form.querySelector('.hero-form-submit')
      btn.disabled = true
      btn.innerHTML = submitSVG + ' Sending to dispatch...'

      const nameInput = form.querySelector('input[name="name"]')
      const emailInput = form.querySelector('input[name="email"]')
      const messageInput = form.querySelector('textarea[name="message"]')

      const payload = {
        full_name: nameInput?.value || '',
        phone: '+1' + digits,
        email: emailInput?.value || '',
        message: messageInput?.value || '',
        source_url: window.location.href,
      }

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (res.ok) {
            card.classList.add('submitted')
          } else {
            btn.disabled = false
            btn.innerHTML = submitSVG + ' Submit Request'
          }
        })
        .catch(() => {
          btn.disabled = false
          btn.innerHTML = submitSVG + ' Submit Request'
        })
    }

    form.addEventListener('submit', handler)
    return () => {
      form.removeEventListener('submit', handler)
      if (phoneInput) {
        phoneInput.removeEventListener('input', onPhoneInput)
        phoneInput.removeEventListener('focus', onPhoneFocus)
        phoneInput.removeEventListener('blur', onPhoneBlur)
      }
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: formCss }} />
      <div className="hero-form-card" ref={cardRef}>
        <div className="hero-form-success">
          <div className="hero-form-success-ring">
            <div className="hero-form-success-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h3>Submission Received</h3>
          <p>Our dispatch team will reach out shortly.</p>
        </div>

        <div className="hero-form-top">
          <h2 className="hero-form-title">Request Service</h2>
          <p className="hero-form-subtitle">Fill out our quick form to schedule a service call with our team today!</p>
          <div className="hero-form-dispatch">
            <span className="hero-form-dispatch-dot"></span>
            <span className="hero-form-dispatch-text">Live</span>
          </div>
        </div>

        <div className="hero-form-body">
          <form ref={formRef}>
            <input type="hidden" name="source_url" ref={urlRef} value="" />
            <div className="hero-form-group"><input className="hero-form-input" type="text" name="name" placeholder="Full Name" required /></div>
            <div className="hero-form-group">
              <div className="hero-form-phone-wrap">
                <span className="hero-form-phone-prefix">+1</span>
                <input className="hero-form-phone-input" type="tel" name="phone" placeholder="(123) 456-7890" required ref={phoneRef} />
              </div>
              <div className="hero-form-phone-error" ref={phoneErrorRef}>Please enter a valid 10-digit phone number</div>
            </div>
            <div className="hero-form-group"><input className="hero-form-input" type="email" name="email" placeholder="Email Address" required /></div>
            <div className="hero-form-group"><textarea className="hero-form-textarea" name="message" placeholder="How can we help?"></textarea></div>
            <button className="hero-form-submit" type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Submit Request
            </button>
            <p className="hero-form-disclaimer">By submitting, you agree to be contacted by one of our agents. Your information is confidential and won't be shared or sold.</p>
            <div className="hero-form-trust">
              <span className="hero-form-trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> No spam</span>
              <span className="hero-form-trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> No obligation</span>
              <span className="hero-form-trust-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Call back in 1 hr</span>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
