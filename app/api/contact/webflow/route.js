import { supabase } from '@/lib/supabase'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders })
}

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('[webflow contact] incoming body:', JSON.stringify(body))

    const data = body.payload?.data || body.data || body

    const full_name = data.full_name || ''
    const phone = data.phone || ''
    const email = data.email || ''
    const message = data.message || ''
    const source_url = data['Page URL'] || data.source_url || ''

    const { error } = await supabase
      .from('form_submissions')
      .insert({ full_name, phone, email, message, source_url })

    if (error) {
      console.error('[webflow contact]', error)
      return Response.json({ success: false, message: error.message }, { status: 500, headers: corsHeaders })
    }

    return Response.json({ success: true }, { headers: corsHeaders })
  } catch (err) {
    console.error('[webflow contact]', err)
    return Response.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders })
  }
}
