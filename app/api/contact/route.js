import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { full_name, phone, email, message, source_url } = await request.json()

    const { error } = await supabase
      .from('form_submissions')
      .insert({ full_name, phone, email, message, source_url })

    if (error) {
      console.error('[contact]', error)
      return Response.json({ success: false, message: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[contact]', err)
    return Response.json({ success: false, message: err.message }, { status: 500 })
  }
}
