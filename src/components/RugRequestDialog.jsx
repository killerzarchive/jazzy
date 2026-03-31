import { useState, useRef } from 'react'
import { createRugRequest } from '../lib/api'
import { uploadRugImage } from '../lib/supabase'

export default function RugRequestDialog({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', width: '', height: '', description: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      let imageUrl = null
      if (imageFile) imageUrl = await uploadRugImage(imageFile)
      await createRugRequest({ ...form, imageUrl })
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    setForm({ name: '', email: '', phone: '', width: '', height: '', description: '' })
    setImageFile(null)
    setImagePreview(null)
    setSubmitted(false)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-y-auto"
        style={{ maxHeight: '92dvh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 sticky top-0 bg-white z-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-black/30 font-semibold">Custom Order</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '0.04em', lineHeight: 1.1 }}>
              Handmade Rug Request
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: '#f4f4f4' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-8">
          {submitted ? (
            <div className="py-16 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-black">Request Submitted!</p>
              <p className="text-[13px] text-black/40 leading-relaxed max-w-xs">
                We received your custom rug request. We'll reach out to you at <strong>{form.email}</strong> with a quote.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-8 py-3 bg-black text-white text-[11px] tracking-[0.2em] uppercase font-bold rounded-2xl"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-5">

              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Name *</label>
                  <input
                    name="name" value={form.name} onChange={handleChange} required
                    placeholder="Your name"
                    className="border-b border-gray-200 focus:border-black outline-none py-2 text-sm text-gray-900 bg-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Phone</label>
                  <input
                    name="phone" value={form.phone} onChange={handleChange}
                    placeholder="Optional"
                    className="border-b border-gray-200 focus:border-black outline-none py-2 text-sm text-gray-900 bg-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Email *</label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder="you@example.com"
                  className="border-b border-gray-200 focus:border-black outline-none py-2 text-sm text-gray-900 bg-transparent"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold block mb-3">Dimensions *</label>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <input
                      name="width" value={form.width} onChange={handleChange} required
                      placeholder='Width (e.g. 5ft)'
                      className="border border-gray-200 focus:border-black outline-none rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-transparent w-full"
                    />
                  </div>
                  <span className="text-black/30 font-bold text-lg">×</span>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <input
                      name="height" value={form.height} onChange={handleChange} required
                      placeholder='Length (e.g. 8ft)'
                      className="border border-gray-200 focus:border-black outline-none rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-transparent w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Description *</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange} required
                  rows={4}
                  placeholder="Describe colors, patterns, style, materials, or any specific details you want..."
                  className="border border-gray-200 focus:border-black outline-none rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-transparent resize-none"
                />
              </div>

              {/* Image upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Inspiration Photo</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded-2xl" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null) }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-28 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors"
                    style={{ border: '2px dashed #e0e0e0' }}
                  >
                    <svg className="w-6 h-6 text-black/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-[11px] text-black/30 tracking-wide">Upload inspiration photo</span>
                  </button>
                )}
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-black text-white text-[11px] tracking-[0.25em] uppercase font-bold rounded-2xl disabled:opacity-50 transition-opacity mt-1"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
