/**
 * Upload a product image via our server-side API route.
 * The route uses the Supabase service role key and auto-creates
 * the bucket if it doesn't exist.
 */
export async function uploadProductImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Upload failed')
  return json.url
}
