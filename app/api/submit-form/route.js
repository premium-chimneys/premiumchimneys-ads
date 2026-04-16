export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)
    const formBody = body || Object.fromEntries(await request.formData())

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formBody),
    })

    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 })
  }
}
