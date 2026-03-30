import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } })
    return Response.json({ categories })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET)

    const { name, slug, imageUrl } = await req.json()
    if (!name || !slug || !imageUrl) {
      return Response.json({ error: 'name, slug, and imageUrl are required' }, { status: 400 })
    }

    const category = await prisma.category.create({ data: { name, slug, imageUrl } })
    return Response.json({ category })
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}
