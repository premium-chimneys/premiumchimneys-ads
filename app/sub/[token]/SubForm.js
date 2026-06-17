'use client'

import { useState } from 'react'

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#6b7280',
  marginBottom: '6px',
}
const control = {
  width: '100%',
  boxSizing: 'border-box',
  height: '48px',
  padding: '0 14px',
  fontSize: '16px', // 16px keeps iOS from zooming the page on focus
  fontFamily: 'inherit',
  color: '#11141a',
  background: '#fff',
  border: '1px solid #d7dbe0',
  borderRadius: '10px',
  outline: 'none',
}
const banner = { borderRadius: '10px', padding: '12px 14px', fontSize: '14px', marginBottom: '16px' }
const bannerOk = { background: '#d1fae5', color: '#065f46' }
const bannerErr = { background: '#fee2e2', color: '#991b1b' }

function fmtLead(l) {
  const name = l.customer_name || 'Job'
  const date = l.report_date ? String(l.report_date).slice(0, 10) : ''
  return date ? `${name} — ${date}` : name
}

export default function SubForm({ token, leads }) {
  const [available, setAvailable] = useState(leads)
  const [rowId, setRowId] = useState(leads[0]?.id != null ? String(leads[0].id) : '')
  const [total, setTotal] = useState('')
  const [parts, setParts] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')

    if (!rowId) {
      setError('Pick a job first.')
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

    // Drop the submitted lead, clear inputs, show confirmation.
    const remaining = available.filter((l) => String(l.id) !== String(rowId))
    setAvailable(remaining)
    setRowId(remaining[0]?.id != null ? String(remaining[0].id) : '')
    setTotal('')
    setParts('')
    setDone(true)
  }

  const header = (
    <>
      <h1 className="sub-heading" style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
        Job Submission
      </h1>
      <p style={{ color: '#11141a', fontSize: '14px', margin: '0 0 20px' }}>
        Select a job below and input the following information.
      </p>
    </>
  )

  if (available.length === 0) {
    return (
      <>
        {header}
        {done ? <div style={{ ...banner, ...bannerOk, marginTop: '16px' }}>Submitted — thanks!</div> : null}
        <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '16px' }}>No open jobs right now.</p>
      </>
    )
  }

  return (
    <form onSubmit={submit}>
      {header}

      {done ? <div style={{ ...banner, ...bannerOk }}>Submitted — thanks!</div> : null}
      {error ? <div style={{ ...banner, ...bannerErr }}>{error}</div> : null}

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="lead" style={labelStyle}>Job</label>
        <select id="lead" style={control} value={rowId} onChange={(e) => setRowId(e.target.value)}>
          {available.map((l) => (
            <option key={l.id} value={String(l.id)}>
              {fmtLead(l)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="total" style={labelStyle}>Total ($)</label>
        <input
          id="total"
          style={control}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="parts" style={labelStyle}>Parts ($)</label>
        <input
          id="parts"
          style={control}
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
    </form>
  )
}
