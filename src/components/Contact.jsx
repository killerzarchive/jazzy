import { useState } from 'react'
import { createInquiry } from '../lib/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setSendError('')
    try {
      await createInquiry(form)
      setSent(true)
    } catch {
      setSendError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="px-5 pt-10 pb-20 max-w-md mx-auto">
      <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Get in touch</p>
      <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-10">Contact</h1>

      {sent ? (
        <div className="text-center py-16 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-700 font-light">Message sent!</p>
          <p className="text-xs text-gray-400">We'll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] tracking-widest uppercase text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="border-b border-gray-200 focus:border-black outline-none py-2.5 text-sm text-gray-900 placeholder-gray-300 bg-transparent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] tracking-widest uppercase text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="border-b border-gray-200 focus:border-black outline-none py-2.5 text-sm text-gray-900 placeholder-gray-300 bg-transparent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] tracking-widest uppercase text-gray-400">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What's on your mind?"
              required
              rows={4}
              className="border-b border-gray-200 focus:border-black outline-none py-2.5 text-sm text-gray-900 placeholder-gray-300 bg-transparent transition-colors resize-none"
            />
          </div>

          {sendError && <p className="text-xs text-red-500">{sendError}</p>}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </form>
      )}

      {/* Social links */}
      <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col gap-3">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-400 mb-2">Find us</p>
        {[
          { label: 'Instagram', handle: '@jazzymarketplace' },
          { label: 'Email', handle: 'jazzy@jazzysmarketplace.com' },
          { label: 'Website', handle: 'jazzysmarketplace.com' },
        ].map((s) => (
          <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-xs text-gray-400 tracking-wide uppercase">{s.label}</span>
            <span className="text-xs text-gray-700">{s.handle}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
