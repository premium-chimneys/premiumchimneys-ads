'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'

const REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJF3FxAPjNTYYRCrTBey-4W0g'
const FEEDBACK_ENDPOINT = 'https://reviewtool.gsmarketingroup.com/api/send-feedback'
const TRACK_ENDPOINT = 'https://reviewtool.gsmarketingroup.com/api/track-event'
const BUSINESS_NAME = 'Premium Chimneys'
const BUSINESS_EMAIL = 'hello@premiumchimneys.com'

function sendTrackingEvent(eventType, extra = {}) {
  if (typeof window === 'undefined') return

  const payload = {
    businessEmail: BUSINESS_EMAIL,
    businessName: BUSINESS_NAME,
    platform: 'google',
    eventType,
    timestamp: new Date().toISOString(),
    pageUrl: window.location.href,
    referrer: document.referrer || '',
    reviewLink: REVIEW_URL,
    widgetUrl: window.location.origin + window.location.pathname + "#reviews",
    ...extra,
  }

  try {
    const body = JSON.stringify(payload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_ENDPOINT, new Blob([body], { type: 'application/json' }))
      return
    }

    fetch(TRACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Tracking failures must never interrupt the review experience.
  }
}

export default function BookReviewWidget() {
  const idPrefix = useId().replace(/:/g, '')
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const previousOverflowRef = useRef('')
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [ratingError, setRatingError] = useState('')
  const [feedbackError, setFeedbackError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const resetState = useCallback(() => {
    setRating(0)
    setFeedback('')
    setShowFeedback(false)
    setRatingError('')
    setFeedbackError('')
    setIsSending(false)
    setIsSent(false)
  }, [])

  const openDialog = useCallback((source = 'button') => {
    resetState()
    setIsOpen(true)
    // Reflect the open popup in the URL so it can be linked to and shared.
    // pushState changes only the hash: no navigation, no reload.
    if (source === 'button' && typeof window !== 'undefined') {
      if (window.location.hash !== '#reviews') {
        window.history.pushState(null, '', window.location.pathname + window.location.search + '#reviews')
      }
    }
    sendTrackingEvent('widget_open', { source })
  }, [resetState])

  const closeDialog = useCallback(() => {
    setIsOpen(false)
    // Drop the hash without reloading or adding a history entry.
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  useEffect(() => {
    function openFromHash() {
      if (['#reviews', '#review'].includes(window.location.hash.toLowerCase().split('?')[0])) {
        openDialog('hash')
      }
    }

    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [openDialog])

  useEffect(() => {
    if (!isOpen) return undefined

    const triggerElement = triggerRef.current
    previousOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeDialog()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll(
          'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), a[href]'
        )
      ).filter((element) => element.getClientRects().length > 0)

      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflowRef.current
      document.removeEventListener('keydown', handleKeyDown)
      triggerElement?.focus()
    }
  }, [closeDialog, isOpen])

  function continueWithRating() {
    if (!rating) {
      setRatingError('Select a star rating first.')
      return
    }

    setRatingError('')
    sendTrackingEvent('rating_selected', { rating })
  }

  
  function leaveGoogleReview() {
    if (!rating) {
      setRatingError('Select a star rating first.')
      return
    }

    setRatingError('')
    sendTrackingEvent('rating_selected', { rating })

    if (rating < 4) {
      setShowFeedback(true)
      setFeedbackError('')
      return
    }

    sendTrackingEvent('review_redirect', { rating })
    window.location.assign(REVIEW_URL)
  }

  async function submitFeedback
() {
    if (!feedback.trim()) {
      setFeedbackError('Add a few words so we know what to improve.')
      return
    }

    setFeedbackError('')
    setIsSending(true)

    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: BUSINESS_NAME,
          businessEmail: BUSINESS_EMAIL,
          customerRating: rating,
          customerFeedback: feedback.trim(),
          platform: 'google',
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) throw new Error('Feedback request failed')

      sendTrackingEvent('feedback_submit', { rating })
      setIsSent(true)
      setShowFeedback(false)
    } catch {
      setFeedbackError('That did not send. Check your connection and try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <div className="rlg-review-trigger-wrap" aria-label="Leave a review">
        <button ref={triggerRef} type="button" className="rlg-review-button" onClick={() => openDialog('button')}>
          Leave Us A Review
        </button>
      </div>

      {isOpen && (
        <div
          className="rlg-popup-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog()
          }}
        >
          <div
            ref={dialogRef}
            className="rlg-popup-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${idPrefix}-title`}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="rlg-close"
              aria-label="Close review dialog"
              onClick={closeDialog}
            >
              &times;
            </button>

            <div className="rlg-review-container">
              <p className="rlg-popup-kicker">Your feedback matters</p>
              <h2 className="rlg-title" id={`${idPrefix}-title`}>{BUSINESS_NAME}</h2>
              <p className="rlg-subtitle">Rate your experience, then choose how you would like to share it.</p>

              {!isSent ? (
                <>
                  <fieldset className="rlg-star-fieldset">
                    <legend className="rlg-sr-only">Choose a star rating</legend>
                    <div className="rlg-star-rating">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <span key={star}>
                          <input
                            type="radio"
                            id={`${idPrefix}-star-${star}`}
                            name={`${idPrefix}-rating`}
                            value={star}
                            checked={rating === star}
                            onChange={() => {
                              setRating(star)
                              setRatingError('')
                            }}
                          />
                          <label htmlFor={`${idPrefix}-star-${star}`} title={`${star} stars`} aria-label={`${star} stars`}>
                            ★
                          </label>
                        </span>
                      ))}
                    </div>
                  </fieldset>

                  {ratingError && <p className="rlg-error" role="alert">{ratingError}</p>}

                  {!rating ? (
                    <button type="button" className="rlg-submit-btn" onClick={continueWithRating}>
                      Continue
                    </button>
                  ) : (
                    <div className="rlg-action-stack">
                      <button type="button" className="rlg-submit-btn" onClick={leaveGoogleReview}>
                        {rating >= 4 ? "Leave an honest Google review" : "Continue"}
                      </button>
                    </div>
                  )}

                  {showFeedback && (
                    <div className="rlg-feedback-form">
                      <label htmlFor={`${idPrefix}-feedback`}>Your private feedback</label>
                      <textarea
                        id={`${idPrefix}-feedback`}
                        value={feedback}
                        onChange={(event) => setFeedback(event.target.value)}
                        placeholder="Tell us what went well or what we can improve..."
                        rows={5}
                      />
                      {feedbackError && <p className="rlg-error" role="alert">{feedbackError}</p>}
                      <button type="button" className="rlg-submit-btn" disabled={isSending} onClick={submitFeedback}>
                        {isSending ? 'Sending...' : 'Send private feedback'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rlg-thank-you" role="status">
                  <p className="rlg-thank-you-mark">✓</p>
                  <p>Thank you for helping us improve.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .rlg-review-trigger-wrap,
        .rlg-review-trigger-wrap * { box-sizing: border-box; }
        .rlg-review-trigger-wrap {
          display: flex;
          justify-content: center;
          margin-top: -40px;
          padding: 0 24px 88px;
          background: #faf9fe;
          font-family: 'Inter Tight', Arial, sans-serif;
        }
        .rlg-review-button,
        .rlg-submit-btn,
        .rlg-secondary-btn {
          border: 0;
          border-radius: 999px;
          padding: 14px 26px;
          font: inherit;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
        }
        .rlg-review-button {
          min-width: 210px;
          background: linear-gradient(135deg, #6f3fb0, #4f2481);
          color: #fff;
          box-shadow: 0 14px 32px rgba(79,36,129,0.28);
        }
        .rlg-review-button:hover,
        .rlg-submit-btn:hover,
        .rlg-secondary-btn:hover { transform: translateY(-1px); }
        .rlg-review-button:focus-visible,
        .rlg-submit-btn:focus-visible,
        .rlg-secondary-btn:focus-visible,
        .rlg-close:focus-visible,
        .rlg-star-rating input:focus-visible + label,
        .rlg-feedback-form textarea:focus-visible {
          outline: 3px solid #bfa4ff;
          outline-offset: 3px;
        }
        .rlg-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: grid;
          place-items: center;
          padding: 24px;
          overflow-y: auto;
          background: rgba(16, 10, 26, 0.72);
          backdrop-filter: blur(7px);
          animation: rlgFadeIn 0.18s ease;
        }
        .rlg-popup-content {
          position: relative;
          width: min(100%, 500px);
          max-height: calc(100vh - 48px);
          overflow-y: auto;
          padding: 38px;
          border: 1px solid rgba(124,58,237,0.16);
          border-radius: 24px;
          background: #fff;
          box-shadow: 0 30px 80px rgba(0,0,0,0.3);
          animation: rlgSlideUp 0.24s ease;
        }
        .rlg-close {
          position: absolute;
          top: 12px;
          right: 14px;
          border: 0;
          background: transparent;
          color: #7c7389;
          font-size: 30px;
          line-height: 1;
          cursor: pointer;
        }
        .rlg-review-container {
          color: #20152d;
          text-align: center;
          font-family: 'Inter Tight', Arial, sans-serif;
        }
        .rlg-popup-kicker {
          margin: 0 0 8px;
          color: #7651ab;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 12px;
          font-weight: 800;
        }
        .rlg-title {
          margin: 0 28px 10px;
          font-size: 28px;
          line-height: 1.15;
          letter-spacing: -0.03em;
        }
        .rlg-subtitle {
          margin: 0 auto 24px;
          max-width: 390px;
          color: #72677f;
          font-size: 15px;
          line-height: 1.55;
        }
        .rlg-star-fieldset { margin: 0; padding: 0; border: 0; }
        .rlg-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .rlg-star-rating {
          display: inline-flex;
          flex-direction: row-reverse;
          justify-content: center;
          margin-bottom: 14px;
        }
        .rlg-star-rating span { position: relative; }
        .rlg-star-rating input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
        }
        .rlg-star-rating label {
          display: block;
          padding: 0 3px;
          color: #ded8e5;
          font-size: 42px;
          line-height: 1;
          cursor: pointer;
          transition: color 0.14s ease, transform 0.14s ease;
        }
        .rlg-star-rating input:checked + label,
        .rlg-star-rating span:has(input:checked) ~ span label,
        .rlg-star-rating label:hover,
        .rlg-star-rating span:hover ~ span label {
          color: #f5b82e;
        }
        .rlg-star-rating label:hover { transform: scale(1.08); }
        .rlg-error {
          margin: 0 0 14px;
          color: #b42318;
          font-size: 13px;
          font-weight: 700;
        }
        .rlg-submit-btn {
          background: #6f3fb0;
          color: #fff;
          box-shadow: 0 10px 22px rgba(111,63,176,0.22);
        }
        .rlg-submit-btn:disabled { opacity: 0.65; cursor: wait; transform: none; }
        .rlg-secondary-btn { background: #f1ecf8; color: #4f3373; }
        .rlg-action-stack {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
          margin-top: 2px;
        }
        .rlg-feedback-form {
          margin-top: 22px;
          padding-top: 22px;
          border-top: 1px solid #ece7f1;
          text-align: left;
        }
        .rlg-feedback-form label {
          display: block;
          margin-bottom: 8px;
          color: #332442;
          font-size: 14px;
          font-weight: 800;
        }
        .rlg-feedback-form textarea {
          width: 100%;
          resize: vertical;
          min-height: 120px;
          margin-bottom: 12px;
          padding: 13px 14px;
          border: 1px solid #dcd3e6;
          border-radius: 12px;
          background: #fcfbfd;
          color: #241731;
          font: inherit;
          line-height: 1.5;
        }
        .rlg-thank-you { padding: 20px 0 8px; }
        .rlg-thank-you-mark {
          margin: 0 0 10px;
          color: #16a36c;
          font-size: 50px;
          line-height: 1;
        }
        .rlg-thank-you p:last-child { margin: 0; color: #4e4259; font-weight: 700; }
        @keyframes rlgFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rlgSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 760px) {
          .rlg-review-trigger-wrap { margin-top: -28px; padding: 0 18px 64px; }
          .rlg-review-button { width: 100%; max-width: 360px; }
          .rlg-popup-overlay { padding: 12px; }
          .rlg-popup-content { max-height: calc(100vh - 24px); padding: 34px 22px 26px; border-radius: 20px; }
          .rlg-title { margin-inline: 20px; font-size: 24px; }
          .rlg-star-rating label { font-size: 38px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rlg-popup-overlay,
          .rlg-popup-content { animation: none; }
          .rlg-review-button,
          .rlg-submit-btn,
          .rlg-secondary-btn,
          .rlg-star-rating label { transition: none; }
        }
      `}</style>
    </>
  )
}
