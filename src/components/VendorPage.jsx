import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '14px',
      fontFamily: 'inherit',
      color: '#111',
      '::placeholder': { color: '#ccc' },
    },
    invalid: { color: '#ef4444' },
  },
}

const PERKS = [
  'Exclusive vendor list sent directly to your email',
  'Direct links to shop with personal high quality vendors',
  'Access to curated sourcing contacts',
  'One-time purchase — yours to keep',
  'Instant delivery after payment',
]

export default function VendorPage() {
  return (
    <Elements stripe={stripePromise}>
      <VendorForm />
    </Elements>
  )
}

function VendorForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [amount, setAmount] = useState(null)
  const [displayFee, setDisplayFee] = useState(parseFloat(process.env.NEXT_PUBLIC_VENDOR_FEE || '49.99'))

  useState(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(({ settings }) => {
        if (settings?.vendor_fee) setDisplayFee(parseFloat(settings.vendor_fee))
      })
      .catch(() => {})
  })

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    try {
      // 1. Create PaymentIntent
      const res = await fetch('/api/vendor/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name }),
      })
      const { clientSecret, amount: amt, error: serverErr } = await res.json()
      if (serverErr) throw new Error(serverErr)
      setAmount(amt)

      // 2. Confirm payment
      const cardNumber = elements.getElement(CardNumberElement)
      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: { name: form.name, email: form.email },
        },
      })
      if (stripeErr) throw new Error(stripeErr.message)
      if (paymentIntent.status !== 'succeeded') throw new Error('Payment incomplete.')

      // 3. Send PDF to email
      await fetch('/api/vendor/send-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name }),
      })

      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-28 px-8 text-center">
        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/30 font-semibold mb-2">Payment Confirmed</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '0.05em', lineHeight: 1 }} className="mb-4">
          You're in!
        </h2>
        <p className="text-[13px] text-black/50 leading-relaxed max-w-xs">
          Your exclusive vendor list has been sent to <span className="text-black font-semibold">{form.email}</span>. Check your inbox to start shopping.
        </p>
      </div>
    )
  }

  return (
    <div className="pt-8 pb-28 px-5 max-w-2xl mx-auto">

      {/* Header */}
      <p className="text-[9px] tracking-[0.4em] uppercase text-black/25 font-semibold mb-2">Jazzy's Showcase</p>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', letterSpacing: '0.04em', lineHeight: 1 }} className="mb-2">
        Shop With Personal Vendors
      </h1>
      <p className="text-[13px] text-black/50 leading-relaxed mb-8 max-w-sm">
        Get exclusive access to our curated vendor list. One-time fee — shop directly with high quality vendors.
      </p>

      {/* Two-col layout on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Left: perks */}
        <div>
          <p className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold mb-4">What you get</p>
          <div className="flex flex-col gap-3 mb-8">
            {PERKS.map((perk, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[13px] text-black/70 leading-snug">{perk}</p>
              </div>
            ))}
          </div>

          {/* Price card */}
          <div className="rounded-2xl p-5 bg-black text-white">
            <p className="text-[9px] tracking-[0.35em] uppercase text-white/40 font-semibold mb-1">One-time fee</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', letterSpacing: '0.03em', lineHeight: 1 }}>
              ${displayFee.toFixed(2)}
            </p>
            <p className="text-[11px] text-white/40 mt-1">Vendor list sent to your email instantly</p>
          </div>
        </div>

        {/* Right: form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <p className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Your Info</p>

          <FormField label="Full name" name="name" value={form.name} onChange={handleChange} required />
          <FormField label="Email" name="email" value={form.email} onChange={handleChange} required type="email" />

          <div style={{ height: 1, background: '#f0f0f0' }} />
          <p className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Payment</p>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Card number</label>
            <div className="border-b border-gray-200 focus-within:border-black py-2.5 transition-colors">
              <CardNumberElement options={CARD_STYLE} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Expiry</label>
              <div className="border-b border-gray-200 focus-within:border-black py-2.5 transition-colors">
                <CardExpiryElement options={CARD_STYLE} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">CVC</label>
              <div className="border-b border-gray-200 focus-within:border-black py-2.5 transition-colors">
                <CardCvcElement options={CARD_STYLE} />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-[11px] text-red-500 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !stripe}
            className="w-full bg-black text-white py-[18px] text-[10px] tracking-[0.3em] uppercase font-bold active:scale-[0.99] transition-all rounded-2xl disabled:opacity-30"
          >
            {loading ? 'Processing…' : `Pay $${displayFee.toFixed(2)} — Get Vendor List`}
          </button>

          <p className="text-[10px] text-black/25 text-center leading-relaxed">
            Secure payment via Stripe. Vendor list sent to your email instantly after payment.
          </p>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, name, value, onChange, required, type = 'text' }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange} required={required}
        className="border-b border-gray-200 focus:border-black outline-none py-2.5 text-sm text-black bg-transparent transition-colors font-medium"
      />
    </div>
  )
}
