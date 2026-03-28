const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET       = 'products'

export async function POST(request) {
  try {
    if (!SERVICE_KEY || SERVICE_KEY === 'your_service_role_key_here') {
      return Response.json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not set in .env.local' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext      = file.name.split('.').pop()
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer   = await file.arrayBuffer()

    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          apikey: SERVICE_KEY,
          'Content-Type': file.type,
        },
        body: buffer,
      }
    )

    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || json?.error || 'Upload failed')

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`
    return Response.json({ url: publicUrl })
  } catch (err) {
    console.error('[upload]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
