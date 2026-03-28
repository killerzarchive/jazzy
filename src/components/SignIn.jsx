import { useState } from 'react'
import { signIn as apiSignIn } from '../lib/api'

export default function SignIn({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  function handleChange(e) {
    setError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await apiSignIn(form)
      onSuccess?.(result)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-black/30 font-semibold mb-1">Store Access</p>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.8rem',
                letterSpacing: '0.06em',
                color: '#000',
                lineHeight: 1,
              }}
            >
              SIGN IN
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors text-black/40 hover:text-black"
            aria-label="Close"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-6 pb-7 flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.3em] uppercase text-black/40 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl text-[13px] font-medium text-black placeholder-black/20 outline-none transition-all"
              style={{ background: '#f5f5f5', border: '1.5px solid transparent' }}
              onFocus={(e) => (e.target.style.borderColor = '#000')}
              onBlur={(e) => (e.target.style.borderColor = 'transparent')}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.3em] uppercase text-black/40 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl text-[13px] font-medium text-black placeholder-black/20 outline-none transition-all"
              style={{ background: '#f5f5f5', border: '1.5px solid transparent' }}
              onFocus={(e) => (e.target.style.borderColor = '#000')}
              onBlur={(e) => (e.target.style.borderColor = 'transparent')}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-black/5">
              <svg className="w-3.5 h-3.5 text-black/50 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[11px] text-black/60 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full bg-black text-white py-3.5 text-[11px] tracking-[0.25em] uppercase font-bold rounded-2xl hover:bg-black/80 active:scale-[0.98] transition-all duration-200 disabled:opacity-40"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
