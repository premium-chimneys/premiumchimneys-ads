import {
  exchangeCodeForTokens,
  computeTokenExpiry,
  graphqlWithToken,
  writeAuth,
} from '@/lib/jobber'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function htmlResponse(status, body) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]))
}

function errorPage(message) {
  return htmlResponse(
    400,
    `<!doctype html><meta charset="utf-8"><title>Jobber connection failed</title>` +
      `<h1>Jobber connection failed</h1><p>${escapeHtml(message)}</p>`
  )
}

// Clear the one-shot CSRF cookie regardless of outcome.
const CLEAR_STATE_COOKIE = 'jobber_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0'

export async function GET(request) {
  const params = request.nextUrl.searchParams
  const code = params.get('code')
  const state = params.get('state')
  const oauthError = params.get('error')

  if (oauthError) {
    console.error(JSON.stringify({ evt: 'jobber.callback_oauth_error', err: oauthError }))
    return errorPage(`Jobber returned an error: ${oauthError}`)
  }
  if (!code || !state) {
    return errorPage('Missing code or state in callback.')
  }

  // Verify the state against the cookie set in /connect (CSRF protection).
  const cookieState = request.cookies.get('jobber_oauth_state')?.value
  if (!cookieState || cookieState !== state) {
    return errorPage('Invalid or expired state. Start again from /api/jobber/connect.')
  }

  if (
    !process.env.JOBBER_CLIENT_ID ||
    !process.env.JOBBER_CLIENT_SECRET ||
    !process.env.JOBBER_REDIRECT_URI
  ) {
    console.error(JSON.stringify({ evt: 'jobber.callback_misconfigured' }))
    return errorPage('Jobber integration is not configured.')
  }

  // 1. Exchange the code for the first token pair.
  let tokens
  try {
    tokens = await exchangeCodeForTokens(code)
  } catch (err) {
    console.error(JSON.stringify({ evt: 'jobber.token_exchange_failed', err: err?.message }))
    return errorPage('Token exchange with Jobber failed.')
  }

  const { access_token, refresh_token, expires_in } = tokens
  const expires_at = computeTokenExpiry(expires_in, access_token)

  // 2. Resolve the Jobber account id with the fresh token (before persisting,
  //    so we store everything in a single upsert).
  let accountId = null
  try {
    const data = await graphqlWithToken(access_token, 'query { account { id } }')
    accountId = data?.account?.id ?? null
  } catch (err) {
    // Non-fatal: store tokens anyway; account_id can be backfilled on first use.
    console.error(JSON.stringify({ evt: 'jobber.account_lookup_failed', err: err?.message }))
  }

  // 3. Upsert the single jobber_auth row.
  try {
    await writeAuth({ access_token, refresh_token, expires_at, account_id: accountId })
  } catch (err) {
    console.error(JSON.stringify({ evt: 'jobber.callback_db_error', err: err?.message }))
    return htmlResponse(
      500,
      `<!doctype html><meta charset="utf-8"><title>Jobber</title>` +
        `<h1>Could not save Jobber tokens</h1><p>${escapeHtml(err?.message || 'unknown error')}</p>`
    )
  }

  console.log(JSON.stringify({ evt: 'jobber.connected', account_id: accountId }))

  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Jobber connected</title>` +
      `<h1>Jobber connected for Premium Chimneys</h1><p>You can close this window.</p>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': CLEAR_STATE_COOKIE,
      },
    }
  )
}
