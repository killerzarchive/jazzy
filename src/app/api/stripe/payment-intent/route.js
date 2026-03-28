import Stripe from 'stripe'

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  try {
    const { amount, email, firstName, lastName } = await req.json()

    // Find existing Stripe customer or create a new one
    const existing = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 })
    let customer
    if (existing.data.length > 0) {
      customer = existing.data[0]
      // Update name in case it changed
      await stripe.customers.update(customer.id, {
        name: `${firstName} ${lastName}`,
      })
    } else {
      customer = await stripe.customers.create({
        email: email.toLowerCase(),
        name: `${firstName} ${lastName}`,
      })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // dollars → cents
      currency: 'usd',
      customer: customer.id,
      receipt_email: email.toLowerCase(),
      payment_method_types: ['card'],
    })

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
      paymentIntentId: paymentIntent.id,
    })
  } catch (err) {
    console.error('Stripe error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
