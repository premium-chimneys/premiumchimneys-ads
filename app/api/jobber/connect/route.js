import { randomBytes } from 'node:crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const JOBBER_AUTHORIZE_URL = 'https://api.getjobber.com/api/oauth/authorize'

function jsonError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// Kick off the Jobber OAuth flow: redirect to Jobber's authorize page. A random
// `state` is set as an httpOnly cookie so the callback can verify the round-trip
// (CSRF protection). Single-tenant — no tenant param needed.
export async function GET() {
  const clientId = process.env.JOBBER_CLIENT_ID
  const redirectUri = process.env.JOBBER_REDIRECT_URI
  if (!clientId || !redirectUri) {
    console.error(JSON.stringify({ evt: 'jobber.connect_misconfigured' }))
    return jsonError(500, 'jobber_misconfigured')
  }

  const state = randomBytes(16).toString('hex')

  const url = new URL(JOBBER_AUTHORIZE_URL)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('state', state)

  console.log(JSON.stringify({ evt: 'jobber.connect_initiated' }))

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      // 10-minute lifetime; Lax so it survives the top-level redirect back from
      // Jobber. Secure because the redirect_uri is an https deployed domain.
      'Set-Cookie': `jobber_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=600`,
    },
  })
}
