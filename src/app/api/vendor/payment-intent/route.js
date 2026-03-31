import { prisma } from '../../../../lib/prisma'

export async function POST(req) {
  try {
    const { email, name } = await req.json()
    const key = process.env.STRIPE_SECRET_KEY

    if (!key) return Response.json({ error: 'Stripe key not configured' }, { status: 500 })

    const auth = 'Basic ' + Buffer.from(key + ':').toString('base64')

    const setting = await prisma.setting.findUnique({ where: { key: 'vendor_fee' } })
    const amount = parseFloat(setting?.value || process.env.VENDOR_FEE || '49.99')

    // Find or create customer
    const searchRes = await fetch(
      `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email.toLowerCase())}&limit=1`,
      { headers: { Authorization: auth } }
    )
    const searchData = await searchRes.json()

    let customerId
    if (searchData.data?.length > 0) {
      customerId = searchData.data[0].id
    } else {
      const createRes = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email: email.toLowerCase(), name }),
      })
      const created = await createRes.json()
      customerId = created.id
    }

    // Create PaymentIntent
    const piRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency: 'usd',
        customer: customerId,
        receipt_email: email.toLowerCase(),
        'payment_method_types[]': 'card',
        'metadata[type]': 'vendor',
        'metadata[email]': email.toLowerCase(),
        'metadata[name]': name,
      }),
    })
    const pi = await piRes.json()

    if (pi.error) return Response.json({ error: pi.error.message }, { status: 400 })

    return Response.json({ clientSecret: pi.client_secret, amount })
  } catch (err) {
    console.error('Vendor payment error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
