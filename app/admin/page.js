'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const PASSWORD = 'rocket99'

// A closed job that sold above this amount but has no parts cost likely needs
// its cost verified (jobs at/below this are assessment-only, no parts expected).
const ASSESSMENT_FLOOR = 69

// Display label -> income_report column. Order defines column order.
const INCOME_FIELDS = [
  { label: 'Date', key: 'report_date' },
  { label: 'customer', key: 'customer_name' },
  { label: 'technician', key: 'technician_name' },
  { label: 'Invoice Number', key: 'jobber_id' },
  { label: 'amount', key: 'sale_amount' },
  { label: 'parts', key: 'parts' },
  { label: 'gross', key: 'gross_profit' },
  { label: 'status', key: 'status' },
]

const INCOME_COLUMNS = INCOME_FIELDS.map((f) => f.label)

// Columns the user can edit inline by clicking the cell. gross_profit is a
// generated column (sale_amount - parts) so it's never directly editable.
const EDITABLE_KEYS = new Set(['technician_name', 'sale_amount', 'parts'])

// Columns rendered as currency / right-friendly numbers.
const MONEY_KEYS = new Set(['sale_amount', 'parts', 'gross_profit'])
const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Display-only status pills. The DB value is unchanged ('upcoming' stays
// 'upcoming'); this only maps it to a label + colors.
const STATUS_BADGES = {
  closed: { bg: '#d1fae5', color: '#065f46', label: 'Paid' },
  upcoming: { bg: '#fef3c7', color: '#92400e', label: 'Scheduled' },
  unpaid: { bg: '#dbeafe', color: '#1e40af', label: 'Unpaid' },
  lost: { bg: '#e5e7eb', color: '#374151', label: 'Lost' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_BADGES[String(status || '').toLowerCase()]
  if (!cfg) return status ? String(status) : '—'
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: 1.5,
        backgroundColor: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  )
}

// True when a money value should read "N/A" instead of $0.00: empty/zero on a
// row that isn't closed.
function isMoneyNA(val, status) {
  const empty = val === null || val === undefined || val === '' || Number(val) === 0
  return empty && String(status || '').toLowerCase() !== 'closed'
}

// A closed or unpaid row that sold above the assessment floor but carries no
// parts cost — its cost probably hasn't been entered in Jobber yet.
function needsCost(row) {
  const status = String(row.status || '').toLowerCase()
  const flaggable = status === 'closed' || status === 'unpaid'
  const partsEmpty = row.parts == null || Number(row.parts) === 0
  const amount = Number(row.sale_amount)
  return flaggable && partsEmpty && Number.isFinite(amount) && amount > ASSESSMENT_FLOOR
}

// Subtle amber tag shown in the Parts cell for flagged rows.
function VerifyCostTag() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 9px',
        borderRadius: '999px',
        fontSize: '11.5px',
        fontWeight: 500,
        lineHeight: 1.6,
        backgroundColor: '#fff7ed',
        color: '#9a3412',
        border: '1px solid #fed7aa',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: '#f97316',
          flexShrink: 0,
        }}
      />
      verify cost
    </span>
  )
}

// Renders one income cell (returns JSX, not just a string).
function renderIncomeCell(key, row) {
  const val = row[key]

  if (key === 'status') return <StatusBadge status={val} />

  // Parts on a flagged row shows the "verify cost" tag instead of $0.00 / dash.
  if (key === 'parts' && needsCost(row)) return <VerifyCostTag />

  if (MONEY_KEYS.has(key)) {
    // Empty/zero on a non-closed row reads as the same dash as Technician/Jobber ID.
    if (isMoneyNA(val, row.status)) return '—'
    const n = Number(val)
    return Number.isNaN(n) ? String(val) : currencyFmt.format(n)
  }

  // Technician, Jobber ID, Customer, Date: keep the dash when empty.
  if (val === null || val === undefined || val === '') return '—'
  return String(val)
}

// Footer total for a money column: sums real numeric values, treating N/A
// (empty/zero) as 0.
function moneyTotal(rows, key) {
  return rows.reduce((sum, r) => sum + (Number(r[key]) || 0), 0)
}

// Placeholder column headings — rename these to your real ad metrics.
const AD_COLUMNS = [
  'Campaign',
  'Impressions',
  'Clicks',
  'CTR',
  'Spend',
  'CPC',
  'Conversions',
  'Cost / Conv.',
]

const TABS = [
  { id: 'income', label: 'Income Report', columns: INCOME_COLUMNS },
  { id: 'ads', label: 'Ad Performance', columns: AD_COLUMNS },
]

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const [tab, setTab] = useState('income')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  // Invoice filter: 'invoiced' (default — rows with an invoice applied, i.e.
  // jobber_id is non-null) or 'all'. Request-only rows leave jobber_id null.
  const [invoiceFilter, setInvoiceFilter] = useState('invoiced')

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  // Inline cell editing: which cell is open ({ id, key }), its draft value,
  // and a per-cell save error. Only EDITABLE_KEYS columns are clickable.
  const [editing, setEditing] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [savingCell, setSavingCell] = useState(false)
  const [cellError, setCellError] = useState('')
  // Set synchronously on Escape so the input's blur handler skips the save.
  const escapingRef = useRef(false)
  // id of the row currently being deleted (disables its button).
  const [deletingId, setDeletingId] = useState(null)

  const activeTab = TABS.find((t) => t.id === tab) || TABS[0]
  const columns = activeTab.columns

  // Fetch income_report rows (ordered by report_date desc), filtered by the
  // From/To date range. Only runs for the Income Report tab while logged in.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!authed || tab !== 'income') return

    let cancelled = false
    setLoading(true)
    setLoadError('')

    let query = supabase
      .from('income_report')
      .select('*')
      .order('report_date', { ascending: false })

    if (start) query = query.gte('report_date', start)
    if (end) query = query.lte('report_date', end)
    // "Invoiced only": jobber_id (Invoice Number) is set only on invoiced rows.
    if (invoiceFilter === 'invoiced') query = query.not('jobber_id', 'is', null)

    query.then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        setLoadError(error.message)
        setRows([])
      } else {
        setRows(data || [])
      }
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [authed, tab, start, end, invoiceFilter])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Open an editable cell, seeding the draft with its current value.
  function startEdit(row, key) {
    if (savingCell) return
    setEditing({ id: row.id, key })
    const raw = row[key]
    setEditValue(raw === null || raw === undefined ? '' : String(raw))
    setCellError('')
  }

  function cancelEdit() {
    setEditing(null)
    setEditValue('')
    setCellError('')
  }

  // Persist the open cell. Money fields parse to a number (blank -> null);
  // technician parses to trimmed text (blank -> null). The update returns the
  // row so the DB-computed gross_profit replaces the local copy.
  async function commitEdit(row, key) {
    const isMoney = MONEY_KEYS.has(key)
    const trimmed = editValue.trim()

    let newVal
    if (isMoney) {
      if (trimmed === '') {
        newVal = null
      } else {
        const n = Number(trimmed)
        if (!Number.isFinite(n)) { setCellError('Enter a number'); return }
        newVal = n
      }
    } else {
      newVal = trimmed === '' ? null : trimmed
    }

    // Skip the write when nothing changed.
    const current = row[key] ?? null
    const same = isMoney
      ? (current === null ? newVal === null : Number(current) === newVal)
      : (current === null ? newVal === null : String(current) === newVal)
    if (same) { cancelEdit(); return }

    setSavingCell(true)
    setCellError('')
    let res, json
    try {
      res = await fetch('/api/income/mutate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: row.id,
          password: PASSWORD,
          patch: { [key]: newVal },
        }),
      })
      json = await res.json()
    } catch (e) {
      setSavingCell(false)
      setCellError(e.message)
      return
    }
    setSavingCell(false)
    if (!res.ok || !json?.ok) { setCellError(json?.error || `error ${res.status}`); return }
    setRows((prev) => prev.map((r) => (r.id === row.id ? json.row : r)))
    setEditing(null)
    setEditValue('')
  }

  // Delete a row after a confirm. Removes it from the local list on success;
  // surfaces a blocking alert on failure (e.g. RLS) so the table stays intact.
  async function deleteRow(row) {
    const label = row.customer_name || row.jobber_id || 'this row'
    if (!window.confirm(`Delete ${label}? This can't be undone.`)) return
    setDeletingId(row.id)
    let res, json
    try {
      res = await fetch('/api/income/mutate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: row.id, password: PASSWORD }),
      })
      json = await res.json()
    } catch (e) {
      setDeletingId(null)
      window.alert(`Couldn't delete: ${e.message}`)
      return
    }
    setDeletingId(null)
    if (!res.ok || !json?.ok) {
      window.alert(`Couldn't delete: ${json?.error || `error ${res.status}`}`)
      return
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id))
  }

  // Restore session so a refresh doesn't kick you back to the login screen.
  // sessionStorage is client-only, so this must run after mount — rendering
  // null until then keeps server and client markup in sync (no hydration flash).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('pc_admin') === '1') {
      setAuthed(true)
    }
    setReady(true)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleLogin(e) {
    e.preventDefault()
    if (value === PASSWORD) {
      setAuthed(true)
      setError(false)
      sessionStorage.setItem('pc_admin', '1')
    } else {
      setError(true)
      setValue('')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('pc_admin')
    setAuthed(false)
    setValue('')
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap');

        .adm * { margin: 0; padding: 0; box-sizing: border-box; }
        .adm {
          min-height: 100vh;
          background: #f6f7f9;
          font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #11141a;
          -webkit-font-smoothing: antialiased;
        }

        /* ---------- Login ---------- */
        .adm-login-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .adm-login {
          width: 100%;
          max-width: 380px;
          background: #fff;
          border: 1px solid #eceef1;
          border-radius: 18px;
          padding: 40px 36px;
          box-shadow: 0 10px 40px rgba(17, 20, 26, 0.06);
        }
        .adm-login h1 {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .adm-login p {
          font-size: 14px;
          color: #8b909a;
          margin-bottom: 28px;
        }
        .adm-field {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .adm-input {
          width: 100%;
          height: 46px;
          padding: 0 14px;
          font-size: 15px;
          font-family: inherit;
          color: #11141a;
          background: #fbfbfc;
          border: 1px solid #e4e7eb;
          border-radius: 11px;
          outline: none;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .adm-input:focus {
          border-color: #11141a;
          box-shadow: 0 0 0 3px rgba(17, 20, 26, 0.06);
        }
        .adm-input.err { border-color: #e5484d; }
        .adm-err {
          font-size: 13px;
          color: #e5484d;
          margin-top: 10px;
        }
        .adm-btn {
          width: 100%;
          height: 46px;
          margin-top: 22px;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          color: #fff;
          background: #11141a;
          border: none;
          border-radius: 11px;
          cursor: pointer;
          transition: opacity .15s ease, transform .05s ease;
        }
        .adm-btn:hover { opacity: .9; }
        .adm-btn:active { transform: translateY(1px); }

        /* ---------- Layout ---------- */
        .adm-layout {
          display: flex;
          min-height: 100vh;
        }
        .adm-sidebar {
          width: 248px;
          flex-shrink: 0;
          background: #14161c;
          border-right: 1px solid #20242d;
          padding: 28px 16px;
          display: flex;
          flex-direction: column;
        }
        .adm-brand {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #fff;
          padding: 6px 12px 24px;
        }
        .adm-nav { display: flex; flex-direction: column; gap: 4px; }
        .adm-tab {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          text-align: left;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: #9aa1ad;
          background: none;
          border: none;
          border-radius: 10px;
          padding: 11px 12px;
          cursor: pointer;
          transition: background .15s ease, color .15s ease;
        }
        .adm-tab:hover { color: #e7e9ee; background: #1c1f27; }
        .adm-tab.active { color: #fff; background: #272b35; }
        .adm-tab-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3a3f4b;
          flex-shrink: 0;
          transition: background .15s ease;
        }
        .adm-tab.active .adm-tab-dot { background: #5b8def; }
        .adm-side-foot {
          margin-top: auto;
          padding: 12px;
        }
        .adm-side-logout {
          font-size: 13px;
          font-weight: 500;
          color: #71767f;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
        }
        .adm-side-logout:hover { color: #e7e9ee; }

        .adm-content { flex: 1; min-width: 0; }

        /* ---------- Dashboard ---------- */
        .adm-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: 56px 40px 80px;
        }
        .adm-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .adm-title {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.03em;
        }
        .adm-sub {
          font-size: 14px;
          color: #8b909a;
          margin-top: 4px;
        }
        .adm-filter {
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }
        .adm-date-group { display: flex; flex-direction: column; }
        .adm-date-group label {
          font-size: 12px;
          font-weight: 500;
          color: #8b909a;
          margin-bottom: 6px;
          padding-left: 2px;
        }
        .adm-date {
          height: 42px;
          padding: 0 12px;
          font-size: 14px;
          font-family: inherit;
          color: #11141a;
          background: #fff;
          border: 1px solid #e4e7eb;
          border-radius: 10px;
          outline: none;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .adm-date:focus {
          border-color: #11141a;
          box-shadow: 0 0 0 3px rgba(17, 20, 26, 0.06);
        }
        .adm-dash {
          align-self: flex-end;
          color: #c2c6cc;
          padding-bottom: 11px;
          font-size: 16px;
        }
        .adm-logout {
          font-size: 13px;
          font-weight: 500;
          color: #8b909a;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0 2px 11px;
        }
        .adm-logout:hover { color: #11141a; }

        /* ---------- Table ---------- */
        .adm-card {
          background: #fff;
          border: 1px solid #eceef1;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 30px rgba(17, 20, 26, 0.04);
        }
        .adm-scroll { overflow-x: auto; }
        table.adm-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 860px;
          table-layout: fixed;
        }
        .adm-table thead th {
          text-align: left;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.01em;
          text-transform: capitalize;
          color: #9aa0a8;
          padding: 16px 20px;
          border-bottom: 1px solid #eceef1;
          background: #fbfbfc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .adm-table tbody td {
          font-size: 14px;
          color: #2a2e35;
          padding: 14px 20px;
          border-bottom: 1px solid #f2f3f5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .adm-table tbody tr:last-child td { border-bottom: none; }
        .adm-table tbody tr:hover td { background: #fafbfc; }
        .adm-num { font-variant-numeric: tabular-nums; }
        /* Inline-editable cells: subtle affordance + hover. */
        .adm-editable { cursor: text; }
        .adm-editable:hover { background: #f0f6ff; box-shadow: inset 0 0 0 1px #d6e4ff; }
        .adm-editing { padding: 6px 12px !important; overflow: visible; }
        .adm-cell-input {
          width: 100%;
          box-sizing: border-box;
          height: 34px;
          padding: 0 10px;
          font-size: 14px;
          font-family: inherit;
          color: #11141a;
          background: #fff;
          border: 1px solid #5b8def;
          border-radius: 8px;
          outline: none;
          box-shadow: 0 0 0 3px rgba(91, 141, 239, 0.12);
        }
        .adm-cell-input:disabled { opacity: 0.6; }
        .adm-cell-err {
          margin-top: 4px;
          font-size: 11.5px;
          color: #b42318;
          white-space: normal;
        }
        /* Per-row delete: revealed at the right edge of the last cell on hover. */
        .adm-cell-last { position: relative; }
        .adm-del {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          color: #b42318;
          background: #fff;
          border: 1px solid #f1d4d4;
          border-radius: 7px;
          cursor: pointer;
          opacity: 0;
          pointer-events: none;
          box-shadow: 0 1px 3px rgba(17, 20, 26, 0.08);
          transition: opacity .12s ease, background .12s ease, border-color .12s ease;
        }
        .adm-row:hover .adm-del,
        .adm-del:focus-visible { opacity: 1; pointer-events: auto; }
        .adm-del:hover { background: #fee4e2; border-color: #f1aeae; }
        .adm-del:disabled { opacity: .5; cursor: default; pointer-events: none; }
        .adm-table tfoot td {
          font-size: 14px;
          font-weight: 700;
          color: #11141a;
          padding: 16px 20px;
          border-top: 2px solid #eceef1;
          background: #fbfbfc;
          white-space: nowrap;
        }
        .adm-empty {
          padding: 64px 24px;
          text-align: center;
        }
        .adm-empty-title {
          font-size: 15px;
          font-weight: 600;
          color: #4b5159;
        }
        .adm-empty-sub {
          font-size: 13px;
          color: #aab0b8;
          margin-top: 6px;
        }

        /* Desktop only: keep the tab sidebar fixed while the table scrolls. */
        @media (min-width: 861px) {
          .adm-sidebar {
            position: sticky;
            top: 0;
            align-self: flex-start;
            height: 100vh;
            overflow-y: auto;
          }
        }

        @media (max-width: 860px) {
          .adm-layout { flex-direction: column; }
          .adm-sidebar {
            width: 100%;
            flex-direction: row;
            align-items: center;
            padding: 12px 14px;
            gap: 8px;
          }
          .adm-brand { display: none; }
          .adm-nav { flex-direction: row; gap: 6px; }
          .adm-side-foot { margin-top: 0; margin-left: auto; padding: 0 6px; }
          .adm-shell { padding: 32px 18px 60px; }
          .adm-head { align-items: flex-start; }
          .adm-title { font-size: 26px; }
        }
      `}} />

      <div className="adm">
        {!ready ? null : !authed ? (
          <div className="adm-login-wrap">
            <form className="adm-login" onSubmit={handleLogin}>
              <h1>Admin</h1>
              <p>Enter your password to continue.</p>

              <label className="adm-field" htmlFor="adm-pw">Password</label>
              <input
                id="adm-pw"
                type="password"
                autoFocus
                autoComplete="current-password"
                className={`adm-input${error ? ' err' : ''}`}
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(false) }}
                placeholder="••••••••"
              />
              {error && <div className="adm-err">Incorrect password. Try again.</div>}

              <button type="submit" className="adm-btn">Log in</button>
            </form>
          </div>
        ) : (
          <div className="adm-layout">
            <aside className="adm-sidebar">
              <div className="adm-brand">Premium Chimneys</div>
              <nav className="adm-nav">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    className={`adm-tab${tab === t.id ? ' active' : ''}`}
                    onClick={() => setTab(t.id)}
                  >
                    <span className="adm-tab-dot" />
                    {t.label}
                  </button>
                ))}
              </nav>
              <div className="adm-side-foot">
                <button className="adm-side-logout" onClick={handleLogout}>Log out</button>
              </div>
            </aside>

            <main className="adm-content">
              <div className="adm-shell">
                <div className="adm-head">
                  <div>
                    <h1 className="adm-title">{activeTab.label}</h1>
                  </div>

                  <div className="adm-filter">
                    <div className="adm-date-group">
                      <label htmlFor="adm-start">From</label>
                      <input
                        id="adm-start"
                        type="date"
                        className="adm-date"
                        value={start}
                        max={end || undefined}
                        onChange={(e) => setStart(e.target.value)}
                      />
                    </div>
                    <span className="adm-dash">–</span>
                    <div className="adm-date-group">
                      <label htmlFor="adm-end">To</label>
                      <input
                        id="adm-end"
                        type="date"
                        className="adm-date"
                        value={end}
                        min={start || undefined}
                        onChange={(e) => setEnd(e.target.value)}
                      />
                    </div>
                    <div className="adm-date-group">
                      <label htmlFor="adm-invoice">Show</label>
                      <select
                        id="adm-invoice"
                        className="adm-date"
                        value={invoiceFilter}
                        onChange={(e) => setInvoiceFilter(e.target.value)}
                      >
                        <option value="all">All</option>
                        <option value="invoiced">Invoiced only</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="adm-card">
                  <div className="adm-scroll">
                    <table className="adm-table">
                      <colgroup>
                        {columns.map((c) => (
                          <col key={c} style={{ width: `${100 / columns.length}%` }} />
                        ))}
                      </colgroup>
                      <thead>
                        <tr>
                          {columns.map((c) => (
                            <th key={c}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tab === 'income' ? (
                          loading ? (
                            <tr>
                              <td className="adm-empty" colSpan={columns.length}>
                                <div className="adm-empty-title">Loading…</div>
                              </td>
                            </tr>
                          ) : loadError ? (
                            <tr>
                              <td className="adm-empty" colSpan={columns.length}>
                                <div className="adm-empty-title">Couldn’t load data</div>
                                <div className="adm-empty-sub">{loadError}</div>
                              </td>
                            </tr>
                          ) : rows.length === 0 ? (
                            <tr>
                              <td className="adm-empty" colSpan={columns.length}>
                                <div className="adm-empty-title">No data yet</div>
                                <div className="adm-empty-sub">
                                  {start && end
                                    ? `No results for ${start} → ${end}.`
                                    : 'No income records found.'}
                                </div>
                              </td>
                            </tr>
                          ) : (
                            rows.map((row, i) => (
                              <tr key={row.id ?? i} className="adm-row">
                                {INCOME_FIELDS.map((f, idx) => {
                                  const isMoney = MONEY_KEYS.has(f.key)
                                  const editable = EDITABLE_KEYS.has(f.key)
                                  const isLast = idx === INCOME_FIELDS.length - 1
                                  const isOpen =
                                    editing && editing.id === row.id && editing.key === f.key
                                  const cls = [
                                    isMoney ? 'adm-num' : null,
                                    editable ? 'adm-editable' : null,
                                    isOpen ? 'adm-editing' : null,
                                    isLast ? 'adm-cell-last' : null,
                                  ].filter(Boolean).join(' ') || undefined
                                  return (
                                    <td
                                      key={f.key}
                                      className={cls}
                                      title={editable && !isOpen ? 'Click to edit' : undefined}
                                      onClick={
                                        editable && !isOpen
                                          ? () => startEdit(row, f.key)
                                          : undefined
                                      }
                                    >
                                      {isOpen ? (
                                        <>
                                          <input
                                            autoFocus
                                            className="adm-cell-input"
                                            type={isMoney ? 'number' : 'text'}
                                            step={isMoney ? '0.01' : undefined}
                                            value={editValue}
                                            disabled={savingCell}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onBlur={() => {
                                              if (escapingRef.current) {
                                                escapingRef.current = false
                                                return
                                              }
                                              commitEdit(row, f.key)
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                e.preventDefault()
                                                commitEdit(row, f.key)
                                              } else if (e.key === 'Escape') {
                                                e.preventDefault()
                                                escapingRef.current = true
                                                cancelEdit()
                                              }
                                            }}
                                          />
                                          {cellError ? (
                                            <div className="adm-cell-err">{cellError}</div>
                                          ) : null}
                                        </>
                                      ) : (
                                        renderIncomeCell(f.key, row)
                                      )}
                                      {isLast && (
                                        <button
                                          type="button"
                                          className="adm-del"
                                          title="Delete row"
                                          aria-label="Delete row"
                                          disabled={deletingId === row.id}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            deleteRow(row)
                                          }}
                                        >
                                          <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                          >
                                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                          </svg>
                                        </button>
                                      )}
                                    </td>
                                  )
                                })}
                              </tr>
                            ))
                          )
                        ) : (
                          <tr>
                            <td className="adm-empty" colSpan={columns.length}>
                              <div className="adm-empty-title">No data yet</div>
                              <div className="adm-empty-sub">
                                Connect a data source to populate this table.
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {tab === 'income' && rows.length > 0 && (
                        <tfoot>
                          <tr>
                            {INCOME_FIELDS.map((f, idx) => {
                              if (MONEY_KEYS.has(f.key)) {
                                return (
                                  <td key={f.key} className="adm-num">
                                    {currencyFmt.format(moneyTotal(rows, f.key))}
                                  </td>
                                )
                              }
                              return <td key={f.key}>{idx === 0 ? 'Total' : ''}</td>
                            })}
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </>
  )
}
