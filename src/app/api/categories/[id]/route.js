import { prisma } from '../../../../lib/prisma'
import jwt from 'jsonwebtoken'

export async function DELETE(req, { params }) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET)

    await prisma.category.delete({ where: { id: parseInt(params.id) } })
    return Response.json({ ok: true })
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}
