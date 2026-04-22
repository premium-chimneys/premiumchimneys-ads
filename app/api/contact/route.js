export async function POST(request) {
  try {
    const { full_name, phone, email, message, source_url } = await request.json()

    const res = await fetch(process.env.BEACON_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-beacon-secret': process.env.BEACON_WEBHOOK_SECRET,
      },
      body: JSON.stringify({ full_name, phone, email, message, source_url }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[contact]', res.status, text)
      return Response.json({ success: false, message: text }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[contact]', err)
    return Response.json({ success: false, message: err.message }, { status: 500 })
  }
}
