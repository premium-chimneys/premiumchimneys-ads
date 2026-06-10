import { readAuthStatus } from '@/lib/jobber'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Reports Jobber connection status without ever reading or returning tokens.
//   connected = a row exists with an account_id
//   expired   = expires_at is in the past
export async function GET() {
  let row
  try {
    row = await readAuthStatus()
  } catch (err) {
    console.error(JSON.stringify({ evt: 'jobber.status_failed', err: err?.message }))
    return Response.json({ error: 'status_unavailable' }, { status: 500 })
  }

  const accountId = row?.account_id ?? null
  const expiresAt = row?.expires_at ?? null
  const connected = Boolean(accountId)
  const expired = expiresAt ? new Date(expiresAt).getTime() <= Date.now() : true

  return Response.json({
    connected,
    account_id: accountId,
    expires_at: expiresAt,
    expired,
  })
}
