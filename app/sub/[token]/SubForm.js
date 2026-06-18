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
  upcoming: { bg: '#fef3c7', color: '#92400e', label: 'Upcoming' },
  open_job: { bg: '#e0e7ff', color: '#3730a3', label: 'Open Job' },
}

const submitBtn = (busy) => ({
  width: '100%',
  height: '50px',
  fontSize: '16px',
  fontWeight: 600,
  color: '#fff',
  background: busy ? '#6b7280' : '#11141a',
  border: 'none',
  borderRadius: '10px',
  cursor: busy ? 'default' : 'pointer',
  fontFamily: 'inherit',
})

function fmtLead(l) {
  const name = l.customer_name || 'Job'
  const date = l.report_date ? String(l.report_date).slice(0, 10) : ''
  return date ? `${name} — ${date}` : name
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

    // Apply the stage transition to the local list, then return to it.
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
    return (
      <>
        {Header}
        <button
          type="button"
          onClick={back}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            margin: '8px 0 14px',
            padding: 0,
            border: 'none',
            background: 'none',
            color: '#6b7280',
            fontSize: '13px',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          ‹ Back to jobs
        </button>

        <div style={{ fontSize: '15px', fontWeight: 600, color: '#11141a', marginBottom: '16px' }}>
          {fmtLead(selected)}
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
            <button type="submit" disabled={submitting} style={submitBtn(submitting)}>
              {submitting ? 'Submitting…' : 'Close Job'}
            </button>
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
              desc="Closed on a price and took a deposit; work not finished yet."
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
            <button type="submit" disabled={submitting} style={submitBtn(submitting)}>
              {submitting ? 'Submitting…' : 'Submit Same-Day Close'}
            </button>
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
            <button type="submit" disabled={submitting} style={submitBtn(submitting)}>
              {submitting ? 'Submitting…' : 'Submit Open Job'}
            </button>
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
        Select a job below and input the following information to complete your submission.
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
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    backgroundColor: tag.bg,
                    color: tag.color,
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
        display: 'block',
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
      <span style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: '#11141a', marginBottom: '2px' }}>
        {title}
      </span>
      <span style={{ display: 'block', fontSize: '13px', lineHeight: '17px', color: '#6b7280' }}>{desc}</span>
    </button>
  )
}
