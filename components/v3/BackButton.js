'use client'

export default function BackButton() {
  const handleClick = () => {
    if (typeof window === 'undefined') return
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <>
      <button type="button" className="back-btn" onClick={handleClick}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M19 12H5M12 19l-7-7 7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      <style>{`
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px 8px 12px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #4a3f65;
          background: #ffffff;
          border: 1px solid rgba(124, 58, 237, 0.18);
          border-radius: 999px;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(26, 18, 37, 0.04);
        }

        .back-btn svg {
          transition: transform 0.2s ease;
        }

        .back-btn:hover {
          color: #6d28d9;
          border-color: rgba(124, 58, 237, 0.4);
          background: #faf7ff;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.12);
        }

        .back-btn:hover svg {
          transform: translateX(-2px);
        }

        .back-btn:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(26, 18, 37, 0.04);
        }
      `}</style>
    </>
  )
}
