export async function POST(request) {
  const formData = await request.formData()

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
