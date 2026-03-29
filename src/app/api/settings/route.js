import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const rows = await prisma.setting.findMany()
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    return Response.json({ settings })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    jwt.verify(token, process.env.JWT_SECRET)

    const { key, value } = await req.json()
    if (!key) return Response.json({ error: 'Missing key' }, { status: 400 })

    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })

    return Response.json({ ok: true })
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}
