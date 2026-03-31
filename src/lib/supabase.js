const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BUCKET       = 'products'

export async function uploadRugImage(file) {
  const ext      = file.name.split('.').pop()
  const filePath = `rug-requests/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
        apikey: ANON_KEY,
        'Content-Type': file.type,
      },
      body: file,
    }
  )
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || json?.error || 'Upload failed')
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`
}

// Upload directly from browser to Supabase — bypasses Vercel's 4.5MB function limit
export async function uploadProductImage(file) {
  const ext      = file.name.split('.').pop()
  const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
        apikey: ANON_KEY,
        'Content-Type': file.type,
      },
      body: file,
    }
  )

  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || json?.error || 'Upload failed')

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`
}
