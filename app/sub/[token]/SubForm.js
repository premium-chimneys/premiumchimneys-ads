'use client'

import { useState } from 'react'

// --- shared field styling (label sits inside the box) ---
const field = {
  border: '1px solid #d7dbe0',
  borderRadius: '10px',
  background: '#fff',
  padding: '8px 14px',
  marginBottom: '14px',
}
const innerLabel = {
  display: 'block',
  fontSize: '11px',
  lineHeight: '11px',
  fontWeight: 400,
  color: '#9ca3af',
  marginBottom: '0px',
}
const innerControl = {
  width: '100%',
  boxSizing: 'border-box',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: '14px',
  lineHeight: '14px',
  fontFamily: 'inherit',
  color: '#000',
}
const innerTextarea = { ...innerControl, lineHeight: '18px', minHeight: '46px', resize: 'none', paddingTop: '2px' }

const banner = { borderRadius: '10px', padding: '12px 14px', fontSize: '14px', marginBottom: '16px' }
const bannerOk = { background: '#d1fae5', color: '#065f46' }
const bannerErr = { background: '#fee2e2', color: '#991b1b' }

const TAGS = {
  upcoming: { bg: 'oklch(0.525 0.223 3.958 / 0.25)', color: 'oklch(0.525 0.223 3.958)', label: 'Upcoming' },
  open_job: { bg: 'oklch(0.437 0.078 188.216 / 0.25)', color: 'oklch(0.437 0.078 188.216)', label: 'Open Job' },
}

const submitBtn = (submitting, succeeded) => ({
  width: '100%',
  height: '50px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#fff',
  background: succeeded ? 'oklch(0.627 0.194 149.214)' : submitting ? '#6b7280' : '#11141a',
  border: 'none',
  borderRadius: '10px',
  cursor: submitting || succeeded ? 'default' : 'pointer',
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

function SubmitButton({ label, submitting, succeeded }) {
  return (
    <button type="submit" disabled={submitting || succeeded} style={submitBtn(submitting, succeeded)}>
      {succeeded ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="8 12.5 11 15.5 16 9" />
        </svg>
      ) : submitting ? (
        'Submitting…'
      ) : (
        label
      )}
    </button>
  )
}

function Field({ id, label, children }) {
  return (
    <div style={field}>
      <label htmlFor={id} style={innerLabel}>{label}</label>
      {children}
    </div>
  )
}

function MoneyInput({ id, value, onChange }) {
  return (
    <input
      id={id}
      style={innerControl}
      type="number"
      inputMode="decimal"
      min="0"
      step="0.01"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0.00"
    />
  )
}

export default function SubForm({ token, leads }) {
  const [available, setAvailable] = useState(leads)
  const [selectedId, setSelectedId] = useState(null)
  const [closeType, setCloseType] = useState(null) // 'same_day' | 'open_job' (upcoming only)
  const [total, setTotal] = useState('')
  const [parts, setParts] = useState('')
  const [deposit, setDeposit] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const selected = available.find((l) => String(l.id) === String(selectedId)) || null

  function resetForm() {
    setCloseType(null)
    setTotal('')
    setParts('')
    setDeposit('')
    setNotes('')
    setError('')
    setSucceeded(false)
  }

  function openLead(lead) {
    setSelectedId(lead.id)
    setDone(false)
    resetForm()
  }

  function back() {
    setSelectedId(null)
    resetForm()
  }

  async function submit(action, fields) {
    setError('')
    setSubmitting(true)
    let res, json
    try {
      res = await fetch('/api/sub/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rowId: selectedId, action, notes, ...fields }),
      })
      json = await res.json()
    } catch {
      setSubmitting(false)
      setError("Couldn't submit — check your connection and try again.")
      return
    }
    setSubmitting(false)
    if (!res.ok || !json?.ok) {
      setError(
        json?.error === 'stage_mismatch'
          ? 'This job was already updated. Pull to refresh.'
          : "Couldn't submit. Please try again."
      )
      return
    }

    // Flash the green check on the button, then apply the transition + go back.
    setSucceeded(true)
    setTimeout(() => {
      if (action === 'open_job_create') {
        setAvailable((prev) =>
          prev.map((l) => (String(l.id) === String(selectedId) ? { ...l, job_stage: 'open_job' } : l))
        )
      } else {
        // closed → drops off the list entirely
        setAvailable((prev) => prev.filter((l) => String(l.id) !== String(selectedId)))
      }
      setSelectedId(null)
      resetForm()
      setDone(true)
    }, 1200)
  }

  // amount helpers — return a number or null
  const num = (v) => {
    const n = Number(v)
    return Number.isFinite(n) && n >= 0 ? n : null
  }

  function submitSameDay(e) {
    e.preventDefault()
    if (num(total) === null || num(parts) === null) { setError('Enter valid non-negative amounts.'); return }
    submit('same_day_close', { total: num(total), parts: num(parts) })
  }
  function submitOpenCreate(e) {
    e.preventDefault()
    if (num(total) === null || num(deposit) === null) { setError('Enter valid non-negative amounts.'); return }
    submit('open_job_create', { total: num(total), deposit: num(deposit) })
  }
  function submitOpenClose(e) {
    e.preventDefault()
    if (num(parts) === null) { setError('Enter a valid non-negative amount.'); return }
    submit('open_job_close', { parts: num(parts) })
  }

  const Header = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/premium-chimneys-submark-logo.png"
        alt="Premium Chimneys"
        width={36}
        height={36}
        style={{ display: 'block', width: '36px', height: '36px', marginBottom: '14px' }}
      />
      <h1 className="sub-heading" style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
        Job Submission
      </h1>
    </>
  )

  // ----- SCREEN 2: a selected lead -----
  if (selected) {
    const tag = TAGS[selected.job_stage] || null
    return (
      <>
        <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={back}
          aria-label="Back to jobs"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            padding: 0,
            border: '1px solid #e4e7eb',
            borderRadius: '10px',
            background: '#fff',
            color: '#11141a',
            cursor: 'pointer',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(96, 83, 246, 0.25)',
              color: '#6053F6',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          {tag ? (
            <div style={{ marginTop: '14px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  backgroundColor: tag.bg,
                  color: tag.color,
                  border: `1px solid ${tag.color}`,
                }}
              >
                {tag.label}
              </span>
            </div>
          ) : null}
          <h1 className="sub-heading" style={{ fontSize: '20px', fontWeight: 700, margin: '8px 0 0' }}>
            {selected.customer_name || 'Customer'}
          </h1>
        </div>
        </div>

        {error ? <div style={{ ...banner, ...bannerErr }}>{error}</div> : null}

        {selected.job_stage === 'open_job' ? (
          // Open job → only Parts + Notes
          <form onSubmit={submitOpenClose}>
            <Field id="parts" label="Parts Total ($)">
              <MoneyInput id="parts" value={parts} onChange={setParts} />
            </Field>
            <Field id="notes" label="Notes (optional)">
              <textarea id="notes" style={innerTextarea} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            <SubmitButton label="Close Job" submitting={submitting} succeeded={succeeded} />
          </form>
        ) : closeType === null ? (
          // Upcoming → choose close type
          <div>
            <ChoiceButton
              title="Same-Day Close"
              desc="Inspection, sweep, or repair finished in one visit."
              onClick={() => { setCloseType('same_day'); setError('') }}
            />
            <ChoiceButton
              title="Open Job"
              desc="Deposit placed but work not completed yet."
              onClick={() => { setCloseType('open_job'); setError('') }}
            />
          </div>
        ) : closeType === 'same_day' ? (
          <form onSubmit={submitSameDay}>
            <Field id="total" label="Amount ($)">
              <MoneyInput id="total" value={total} onChange={setTotal} />
            </Field>
            <Field id="parts" label="Parts ($)">
              <MoneyInput id="parts" value={parts} onChange={setParts} />
            </Field>
            <Field id="notes" label="Notes (optional)">
              <textarea id="notes" style={innerTextarea} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            <SubmitButton label="Submit Same-Day Close" submitting={submitting} succeeded={succeeded} />
          </form>
        ) : (
          <form onSubmit={submitOpenCreate}>
            <Field id="total" label="Amount ($)">
              <MoneyInput id="total" value={total} onChange={setTotal} />
            </Field>
            <Field id="deposit" label="Deposit ($)">
              <MoneyInput id="deposit" value={deposit} onChange={setDeposit} />
            </Field>
            <Field id="notes" label="Notes (optional)">
              <textarea id="notes" style={innerTextarea} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            <SubmitButton label="Submit Open Job" submitting={submitting} succeeded={succeeded} />
          </form>
        )}
      </>
    )
  }

  // ----- SCREEN 1: the job list -----
  return (
    <>
      {Header}
      <p style={{ color: '#11141a', fontSize: '14px', lineHeight: '20px', margin: '0 0 20px' }}>
        Select a customer below and input the following information to complete your submission.
      </p>

      {done ? <div style={{ ...banner, ...bannerOk }}>Submitted — thanks!</div> : null}

      <div>
        {available.map((l) => {
          const tag = TAGS[l.job_stage] || null
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => openLead(l)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                textAlign: 'left',
                padding: '14px',
                marginBottom: '10px',
                border: '1px solid #e4e7eb',
                borderRadius: '12px',
                background: '#fff',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: '15px', color: '#11141a' }}>{l.customer_name || 'Job'}</span>
              {tag ? (
                <span
                  style={{
                    flexShrink: 0,
                    padding: '3px 6px',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    backgroundColor: tag.bg,
                    color: tag.color,
                    border: `1px solid ${tag.color}`,
                  }}
                >
                  {tag.label}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </>
  )
}

function ChoiceButton({ title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left',
        padding: '14px',
        marginBottom: '12px',
        border: '1px solid #d7dbe0',
        borderRadius: '12px',
        background: '#fff',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: '#11141a', marginBottom: '2px' }}>
          {title}
        </span>
        <span style={{ display: 'block', fontSize: '13px', lineHeight: '17px', color: '#6b7280' }}>{desc}</span>
      </span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9ca3af"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <polyline points="9 6 15 12 9 18" />
      </svg>
    </button>
  )
}
