'use client'

import { useState } from 'react'

// Each field is a bordered box with the label inside it (small, light gray)
// sitting above a borderless value/control.
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
  height: '24px',
  fontSize: '14px',
  lineHeight: '14px',
  fontFamily: 'inherit',
  color: '#000',
}
const innerControlReadOnly = { ...innerControl, cursor: 'not-allowed' }
// Native selects carry a small built-in left inset; appearance:none drops it so
// the text aligns flush with the label. A real chevron element (below) keeps the
// dropdown cue and can rotate on open.
const innerSelect = {
  ...innerControl,
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  textIndent: 0,
  cursor: 'pointer',
  paddingRight: '18px',
}
// Vertically centered on the whole field box; points right, rotates down on open.
const chevron = {
  position: 'absolute',
  right: '14px',
  top: '50%',
  display: 'flex',
  color: '#9ca3af',
  pointerEvents: 'none',
  transition: 'transform 0.15s ease',
}

const banner = { borderRadius: '10px', padding: '12px 14px', fontSize: '14px', marginBottom: '16px' }
const bannerOk = { background: '#d1fae5', color: '#065f46' }
const bannerErr = { background: '#fee2e2', color: '#991b1b' }

function fmtLead(l) {
  const name = l.customer_name || 'Job'
  const date = l.report_date ? String(l.report_date).slice(0, 10) : ''
  return date ? `${name} — ${date}` : name
}

export default function SubForm({ token, subName, leads }) {
  const [available, setAvailable] = useState(leads)
  const [rowId, setRowId] = useState('')
  const [total, setTotal] = useState('')
  const [parts, setParts] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  const jobSelected = rowId !== ''

  async function submit(e) {
    e.preventDefault()
    setError('')

    if (!rowId) {
      setError('Select a job first.')
      return
    }
    const t = Number(total)
    const p = Number(parts)
    if (!Number.isFinite(t) || t < 0 || !Number.isFinite(p) || p < 0) {
      setError('Enter valid non-negative amounts.')
      return
    }

    setSubmitting(true)
    let res, json
    try {
      res = await fetch('/api/sub/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rowId, total: t, parts: p }),
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
        json?.error === 'not_allowed_or_already_submitted'
          ? 'That job was already submitted.'
          : "Couldn't submit. Please try again."
      )
      return
    }

    // Drop the submitted lead, collapse the amount fields, show confirmation.
    setAvailable(available.filter((l) => String(l.id) !== String(rowId)))
    setRowId('')
    setTotal('')
    setParts('')
    setDone(true)
  }

  return (
    <form onSubmit={submit}>
      <h1 className="sub-heading" style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
        Job Submission
      </h1>
      <p style={{ color: '#11141a', fontSize: '14px', lineHeight: '20px', margin: '0 0 20px' }}>
        Select a job below and input the following information to complete your submission.
      </p>

      {done ? <div style={{ ...banner, ...bannerOk }}>Submitted — thanks!</div> : null}
      {error ? <div style={{ ...banner, ...bannerErr }}>{error}</div> : null}

      {/* 1. Subcontractor — predefined, read-only */}
      <div style={field}>
        <label htmlFor="tech" style={innerLabel}>Subcontractor</label>
        <input id="tech" style={innerControlReadOnly} value={subName} disabled />
      </div>

      {/* 2. Open request picker */}
      <div style={{ ...field, position: 'relative' }}>
        <label htmlFor="lead" style={innerLabel}>Job</label>
        <select
          id="lead"
          style={innerSelect}
          value={rowId}
          onChange={(e) => setRowId(e.target.value)}
          onFocus={() => setSelectOpen(true)}
          onBlur={() => setSelectOpen(false)}
        >
          <option value="">Select a job</option>
          {available.map((l) => (
            <option key={l.id} value={String(l.id)}>
              {fmtLead(l)}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          style={{
            ...chevron,
            transform: selectOpen ? 'translateY(-50%) rotate(90deg)' : 'translateY(-50%)',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </span>
      </div>

      {/* 3 & 4. Amounts — only once a job is selected */}
      {jobSelected ? (
        <>
          <div style={field}>
            <label htmlFor="total" style={innerLabel}>Job Total ($)</label>
            <input
              id="total"
              style={innerControl}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div style={{ ...field, marginBottom: '22px' }}>
            <label htmlFor="parts" style={innerLabel}>Parts Total ($)</label>
            <input
              id="parts"
              style={innerControl}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={parts}
              onChange={(e) => setParts(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              height: '50px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#fff',
              background: submitting ? '#6b7280' : '#11141a',
              border: 'none',
              borderRadius: '10px',
              cursor: submitting ? 'default' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </>
      ) : null}
    </form>
  )
}
