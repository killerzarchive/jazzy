import { Resend } from 'resend'

export async function POST(req) {
  try {
    const { email, firstName, lastName, address, city, state, zip, country, items, subtotal, shipping, total, stripePaymentId } = await req.json()

    const resend = new Resend(process.env.RESEND_API_KEY)

    const itemRows = items.map((item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; color: #333;">
          ${item.name}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; color: #333; text-align: center;">
          ${item.qty}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; color: #333; text-align: right;">
          $${(item.price * item.qty).toFixed(2)}
        </td>
      </tr>
    `).join('')

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Jazzy's Drop Shop <noreply@jazzysdrops.com>",
      to: email,
      subject: `Order Confirmed — Jazzy's Drop Shop`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111;">

          <div style="background: #000; padding: 28px 32px; border-radius: 16px 16px 0 0;">
            <p style="margin: 0 0 4px 0; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.4); font-weight: 600;">
              Order Confirmed
            </p>
            <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px;">
              Jazzy's Drop Shop
            </h1>
          </div>

          <div style="background: #fafafa; padding: 24px 32px; border-left: 1px solid #efefef; border-right: 1px solid #efefef;">
            <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">
              Hey <strong style="color: #111;">${firstName}</strong>, thanks for your order! Here's your receipt.
            </p>
          </div>

          <div style="padding: 24px 32px; border: 1px solid #efefef; border-top: none;">

            <!-- Items -->
            <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #aaa; font-weight: 600; margin: 0 0 12px 0;">
              Items
            </p>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #ccc; font-weight: 600; padding-bottom: 8px;">Product</th>
                  <th style="text-align: center; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #ccc; font-weight: 600; padding-bottom: 8px;">Qty</th>
                  <th style="text-align: right; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #ccc; font-weight: 600; padding-bottom: 8px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>

            <!-- Totals -->
            <div style="margin-top: 16px; padding-top: 16px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 13px; color: #888;">Subtotal</span>
                <span style="font-size: 13px; color: #888;">$${subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <span style="font-size: 13px; color: #888;">Shipping</span>
                <span style="font-size: 13px; color: #888;">$${shipping.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid #111;">
                <span style="font-size: 15px; font-weight: 800; color: #111;">Total</span>
                <span style="font-size: 15px; font-weight: 800; color: #111;">$${total.toFixed(2)}</span>
              </div>
            </div>

            <!-- Shipping address -->
            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
              <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #aaa; font-weight: 600; margin: 0 0 8px 0;">
                Shipping To
              </p>
              <p style="font-size: 13px; color: #555; line-height: 1.7; margin: 0;">
                ${firstName} ${lastName}<br/>
                ${address}<br/>
                ${city}, ${state} ${zip}<br/>
                ${country}
              </p>
            </div>

            <!-- Payment ref -->
            ${stripePaymentId ? `
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0f0f0;">
              <p style="font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #aaa; font-weight: 600; margin: 0 0 4px 0;">
                Payment Reference
              </p>
              <p style="font-size: 11px; color: #bbb; font-family: monospace; margin: 0;">${stripePaymentId}</p>
            </div>
            ` : ''}

          </div>

          <div style="padding: 20px 32px; background: #fafafa; border: 1px solid #efefef; border-top: none; border-radius: 0 0 16px 16px;">
            <p style="font-size: 11px; color: #ccc; margin: 0; line-height: 1.6;">
              Jazzy's Drop Shop · Questions? Reply to this email.
            </p>
          </div>

        </div>
      `,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Order confirmation email error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
