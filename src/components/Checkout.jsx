import { useState, useCallback, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createOrder } from '../lib/api'

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

export default function Checkout({ cartItems, products, onBack, onSuccess }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm cartItems={cartItems} products={products} onBack={onBack} onSuccess={onSuccess} />
    </Elements>
  )
}

function CheckoutForm({ cartItems, products, onBack, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()

  const [shippingFee, setShippingFee] = useState(20)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(({ settings }) => {
        if (settings?.shipping_fee) setShippingFee(parseFloat(settings.shipping_fee))
      })
      .catch(() => {})
  }, [])

  const enriched = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return null
      return { ...item, product }
    })
    .filter(Boolean)

  const subtotal = enriched.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  const shipping = subtotal > 0 ? shippingFee : 0
  const total = subtotal + shipping

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })
  const [placed, setPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      // 1. Create PaymentIntent + Stripe customer on server
      const res = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      })
      const { clientSecret, customerId, paymentIntentId, error: serverError } = await res.json()
      if (serverError) throw new Error(serverError)

      // 2. Confirm payment with Stripe
      const cardNumber = elements.getElement(CardNumberElement)
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            address: {
              line1: form.address,
              city: form.city,
              state: form.state,
              postal_code: form.zip,
              country: form.country,
            },
          },
        },
      })

      if (stripeError) throw new Error(stripeError.message)
      if (paymentIntent.status !== 'succeeded') throw new Error('Payment was not completed.')

      // 3. Save order to database
      await createOrder({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: form.country,
        subtotal,
        shipping,
        total,
        stripeCustomerId: customerId,
        stripePaymentId: paymentIntent.id,
        items: enriched.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          qty: i.qty,
        })),
      })

      setPlaced(true)
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (placed) {
    return (
      <div className="flex flex-col items-center justify-center py-28 px-8 text-center">
        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-6">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[11px] tracking-[0.25em] uppercase text-black/30 mb-2">Order Confirmed</p>
        <h2
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.05em', lineHeight: 1 }}
          className="mb-3"
        >
          You're all set.
        </h2>
        <p className="text-[13px] text-black/40 leading-relaxed max-w-xs">
          A receipt was sent to <span className="text-black font-medium">{form.email}</span>. We'll notify you when your order ships.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="pt-6 pb-36">

      {/* Contact */}
      <SectionLabel>Contact</SectionLabel>
      <div className="flex flex-col gap-5 mb-8">
        <Field label="Email" name="email" value={form.email} onChange={handleChange} required type="email" />
      </div>

      {/* Shipping */}
      <SectionLabel>Shipping</SectionLabel>
      <div className="flex flex-col gap-5 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" name="firstName" value={form.firstName} onChange={handleChange} required />
          <Field label="Last name" name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <Field label="Address" name="address" value={form.address} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" name="city" value={form.city} onChange={handleChange} required />
          <Field label="State" name="state" value={form.state} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="ZIP" name="zip" value={form.zip} onChange={handleChange} required />
          <div className="flex flex-col gap-2">
            <label className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold">Country</label>
            <select
              name="country" value={form.country} onChange={handleChange}
              className="border-b border-gray-200 focus:border-black outline-none py-2.5 text-sm text-black bg-transparent transition-colors"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment — Stripe Elements */}
      <SectionLabel>Payment</SectionLabel>
      <div className="flex flex-col gap-5 mb-8">
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
      </div>

      {/* Order summary */}
      <div className="pt-5 mb-6" style={{ borderTop: '1px solid #f0f0f0' }}>
        <p className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold mb-4">Order Summary</p>
        <div className="flex flex-col gap-2.5">
          {enriched.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span className="text-[13px] text-black/60 truncate pr-4">{item.product.name} × {item.qty}</span>
              <span className="text-[13px] text-black/60 flex-shrink-0">${(item.product.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-[13px] text-black/40 pt-1">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[14px] font-semibold text-black pt-2" style={{ borderTop: '1px solid #f0f0f0' }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
          <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-[11px] text-red-500 font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white" style={{ borderTop: '1px solid #f5f5f5' }}>
        <button
          type="submit"
          disabled={loading || !stripe}
          className="w-full bg-black text-white py-[18px] text-[10px] tracking-[0.3em] uppercase font-bold active:scale-[0.99] transition-all rounded-2xl disabled:opacity-30"
        >
          {loading ? 'Processing…' : `Place Order · $${total.toFixed(2)}`}
        </button>
      </div>
    </form>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-[9px] tracking-[0.35em] uppercase text-black/30 font-semibold mb-5">{children}</p>
  )
}

function Field({ label, name, value, onChange, required, type = 'text' }) {
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
