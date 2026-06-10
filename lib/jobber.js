import { createClient } from '@supabase/supabase-js'

// Minimal single-tenant Jobber GraphQL client for Premium Chimneys.
// One Jobber account, one row of tokens (jobber_auth, id = 1). No multi-tenancy.
//
// SERVER-ONLY: this module reads SUPABASE_SERVICE_ROLE_KEY (a non-public env)
// and must only be imported from route handlers / server code, never a client
// component.

const GRAPHQL_URL = 'https://api.getjobber.com/api/graphql'
const TOKEN_URL = 'https://api.getjobber.com/api/oauth/token'

// Pinned Jobber GraphQL API version. Bump deliberately after reviewing Jobber's
// changelog (https://developer.getjobber.com/docs/changelog).
export const JOBBER_GRAPHQL_VERSION = '2025-01-20'

const TIMEOUT_MS = 15_000
// Refresh a little before actual expiry so an in-flight call never races the
// boundary.
const REFRESH_SKEW_SECONDS = 120

function requireEnv(name) {
  const v = process.env[name]
  if (typeof v !== 'string' || v.length === 0) {
    throw new Error(`jobber: missing required env ${name}`)
  }
  return v
}

// Server-only Supabase client using the SERVICE-ROLE key. The token table holds
// live Jobber credentials, so it must never be reachable with the public anon
// key — RLS is enabled on jobber_auth and the service role bypasses it.
let _admin = null
function admin() {
  if (_admin) return _admin
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  _admin = createClient(url, key, { auth: { persistSession: false } })
  return _admin
}

// Exposes the server-only service-role Supabase client for other server modules
// (e.g. the invoice sync writing to income_report). Same singleton, same
// RLS-bypassing key — never import this into client code.
export function serviceSupabase() {
  return admin()
}

// ---------------------------------------------------------------------------
// Token expiry
// ---------------------------------------------------------------------------

// Jobber's /oauth/token response does NOT include expires_in — the expiry lives
// in the access_token JWT's `exp` claim (Unix seconds). Decode the middle
// segment to recover it.
export function expiryFromJwt(jwt) {
  if (typeof jwt !== 'string') return null
  const parts = jwt.split('.')
  if (parts.length < 2) return null
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
    const exp = Number(payload?.exp)
    if (!Number.isFinite(exp)) return null
    const date = new Date(exp * 1000)
    return Number.isNaN(date.getTime()) ? null : date.toISOString()
  } catch {
    return null
  }
}

// Always returns a valid ISO expiry string for storage:
//   1. expires_in if Jobber ever starts sending it,
//   2. else the JWT exp claim,
//   3. else now + 60min (Jobber access tokens are ~1h).
export function computeTokenExpiry(expiresInSeconds, accessToken) {
  const secs = Number(expiresInSeconds)
  if (Number.isFinite(secs)) {
    const d = new Date(Date.now() + secs * 1000)
    if (!Number.isNaN(d.getTime())) return d.toISOString()
  }
  return expiryFromJwt(accessToken) || new Date(Date.now() + 3600 * 1000).toISOString()
}

// ---------------------------------------------------------------------------
// Token storage (single row, id = 1)
// ---------------------------------------------------------------------------

export async function readAuth() {
  const { data, error } = await admin()
    .from('jobber_auth')
    .select('access_token, refresh_token, expires_at, account_id')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw new Error(`jobber: jobber_auth read failed: ${error.message}`)
  return data || null
}

// Non-secret status read: selects ONLY account_id + expires_at, never the
// tokens. Used by /api/jobber/status.
export async function readAuthStatus() {
  const { data, error } = await admin()
    .from('jobber_auth')
    .select('account_id, expires_at')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw new Error(`jobber: jobber_auth status read failed: ${error.message}`)
  return data || null
}

export async function writeAuth(fields) {
  const { error } = await admin()
    .from('jobber_auth')
    .upsert(
      { id: 1, ...fields, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )
  if (error) throw new Error(`jobber: jobber_auth write failed: ${error.message}`)
}

// ---------------------------------------------------------------------------
// OAuth token endpoint
// ---------------------------------------------------------------------------

async function tokenRequest(body) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let res
  try {
    res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body.toString(),
      signal: controller.signal,
    })
  } catch (err) {
    throw new Error(
      `jobber: token request failed: ${err?.name === 'AbortError' ? 'timeout' : err?.message || 'fetch_error'}`
    )
  } finally {
    clearTimeout(timer)
  }

  const text = await res.text().catch(() => '')
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }

  if (!res.ok || !json?.access_token || !json?.refresh_token) {
    const detail = json?.error || (text ? text.slice(0, 300) : `http_${res.status}`)
    throw new Error(`jobber: token request rejected (${res.status}): ${detail}`)
  }
  return json
}

// Exchange an authorization code for the first token pair. Used by the callback.
export async function exchangeCodeForTokens(code) {
  const body = new URLSearchParams()
  body.set('client_id', requireEnv('JOBBER_CLIENT_ID'))
  body.set('client_secret', requireEnv('JOBBER_CLIENT_SECRET'))
  body.set('grant_type', 'authorization_code')
  body.set('code', code)
  body.set('redirect_uri', requireEnv('JOBBER_REDIRECT_URI'))
  return tokenRequest(body)
}

// ---------------------------------------------------------------------------
// Access-token lifecycle
// ---------------------------------------------------------------------------

// Jobber rotates refresh tokens: every refresh returns a NEW refresh_token, so
// we must persist both halves or the old refresh_token dies. A module-level
// in-flight promise coalesces concurrent callers so two requests never refresh
// against the same rotated token.
let refreshInFlight = null

async function doRefresh() {
  const auth = await readAuth()
  if (!auth?.refresh_token) {
    throw new Error('jobber: no refresh_token stored — connect first at /api/jobber/connect')
  }

  const body = new URLSearchParams()
  body.set('client_id', requireEnv('JOBBER_CLIENT_ID'))
  body.set('client_secret', requireEnv('JOBBER_CLIENT_SECRET'))
  body.set('grant_type', 'refresh_token')
  body.set('refresh_token', auth.refresh_token)

  const json = await tokenRequest(body)
  await writeAuth({
    access_token: json.access_token,
    refresh_token: json.refresh_token, // rotated — persist the new one
    expires_at: computeTokenExpiry(json.expires_in, json.access_token),
    account_id: auth.account_id,
  })
  return json.access_token
}

export function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

export async function getValidAccessToken() {
  const auth = await readAuth()
  if (!auth?.access_token || !auth?.refresh_token) {
    if (auth?.refresh_token) return refreshAccessToken()
    throw new Error('jobber: not connected — run /api/jobber/connect')
  }
  const expMs = auth.expires_at ? new Date(auth.expires_at).getTime() : 0
  if (expMs - Date.now() > REFRESH_SKEW_SECONDS * 1000) {
    return auth.access_token
  }
  return refreshAccessToken()
}

// ---------------------------------------------------------------------------
// GraphQL
// ---------------------------------------------------------------------------

// Low-level GraphQL call with an explicit bearer token. Used both by the
// authenticated wrapper below and by the callback (which has a fresh token in
// hand before anything is persisted).
export async function graphqlWithToken(token, query, variables) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let res
  try {
    res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-JOBBER-GRAPHQL-VERSION': JOBBER_GRAPHQL_VERSION,
      },
      body: JSON.stringify({ query, variables: variables || {} }),
      signal: controller.signal,
    })
  } catch (err) {
    throw new Error(
      `jobber: graphql request failed: ${err?.name === 'AbortError' ? 'timeout' : err?.message || 'fetch_error'}`
    )
  } finally {
    clearTimeout(timer)
  }

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(`jobber: graphql http ${res.status}: ${JSON.stringify(json?.errors || json)}`)
  }
  if (json?.errors?.length) {
    throw new Error(`jobber: graphql errors: ${JSON.stringify(json.errors)}`)
  }
  return json?.data ?? null
}

// Authenticated GraphQL call: resolves a valid (auto-refreshed) token first.
export async function jobberGraphQL(query, variables) {
  const token = await getValidAccessToken()
  return graphqlWithToken(token, query, variables)
}

// Non-throwing variant: returns the full { ok, status, data, errors } shape
// without throwing on GraphQL errors. Useful for introspection / debugging
// where partial data + the errors array are both worth seeing. Never includes
// token data. Still resolves (and may refresh) a valid access token first.
export async function jobberGraphQLRaw(query, variables) {
  const token = await getValidAccessToken()

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let res
  try {
    res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-JOBBER-GRAPHQL-VERSION': JOBBER_GRAPHQL_VERSION,
      },
      body: JSON.stringify({ query, variables: variables || {} }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    return {
      ok: false,
      status: 0,
      data: null,
      errors: [{ message: err?.name === 'AbortError' ? 'timeout' : err?.message || 'fetch_error' }],
    }
  }
  clearTimeout(timer)

  const json = await res.json().catch(() => null)
  return {
    ok: res.ok && !(json?.errors?.length),
    status: res.status,
    data: json?.data ?? null,
    errors: json?.errors ?? null,
  }
}
