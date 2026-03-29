import { Resend } from 'resend'

export async function POST(req) {
  try {
    const { email, name } = await req.json()

    const resend = new Resend(process.env.RESEND_API_KEY)
    const pdfUrl = process.env.VENDOR_PDF_URL

    if (!pdfUrl) {
      return Response.json({ error: 'VENDOR_PDF_URL not configured' }, { status: 500 })
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Jazzy\'s Drop Shop <noreply@jazzysdrops.com>',
      to: email,
      subject: 'Your Vendor Shopping Link — Jazzy\'s Drop Shop',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
          <h1 style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px;">
            Hey ${name || 'there'}!
          </h1>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for your purchase! You now have access to our exclusive vendor list.
            Click the link below to browse and shop directly with our vendors.
          </p>
          <a
            href="${pdfUrl}"
            style="display: inline-block; background: #000; color: #fff; padding: 14px 28px; border-radius: 12px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; text-decoration: none;"
          >
            Shop With Vendors
          </a>
          <p style="color: #aaa; font-size: 12px; margin-top: 32px;">
            If the button doesn't work, copy and paste this link:<br/>
            <a href="${pdfUrl}" style="color: #000;">${pdfUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 32px 0;" />
          <p style="color: #ccc; font-size: 11px;">
            Jazzy's Drop Shop · Questions? Reply to this email.
          </p>
        </div>
      `,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Send PDF email error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
