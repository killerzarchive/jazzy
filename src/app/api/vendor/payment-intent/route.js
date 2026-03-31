import Stripe from 'stripe'
import { prisma } from '../../../../lib/prisma'

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    maxNetworkRetries: 0,
    httpClient: Stripe.createFetchHttpClient(),
  })

  try {
    const { email, name } = await req.json()

    const setting = await prisma.setting.findUnique({ where: { key: 'vendor_fee' } })
    const amount = parseFloat(setting?.value || process.env.VENDOR_FEE || '49.99')

    const existing = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 })
    let customer
    if (existing.data.length > 0) {
      customer = existing.data[0]
    } else {
      customer = await stripe.customers.create({ email: email.toLowerCase(), name })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      customer: customer.id,
      receipt_email: email.toLowerCase(),
      payment_method_types: ['card'],
      metadata: { type: 'vendor', email: email.toLowerCase(), name },
    })

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      amount,
    })
  } catch (err) {
    console.error('Vendor payment error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
