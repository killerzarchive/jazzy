import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
}

function toProduct(p) {
  const allImages = p.mediaUrls ? JSON.parse(p.mediaUrls) : [p.imageUrl]
  return {
    ...p,
    image: p.imageUrl,
    images: allImages,
    sizes: p.sizes ? JSON.parse(p.sizes) : [],
  }
}

function toOrder(o) {
  return {
    ...o,
    createdAt: o.createdAt.toISOString(),
  }
}

function requireAuth(context) {
  if (!context?.userId) throw new Error('Unauthorized')
}

export const resolvers = {
  Query: {
    products: async (_parent, { category }) => {
      const where = category && category !== 'all' ? { category } : {}
      const rows = await prisma.product.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { id: 'asc' }],
      })
      return rows.map(toProduct)
    },

    product: async (_parent, { id }) => {
      const p = await prisma.product.findUnique({ where: { id } })
      return p ? toProduct(p) : null
    },

    orders: async (_parent, _args, context) => {
      requireAuth(context)
      const rows = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      })
      return rows.map(toOrder)
    },
  },

  Mutation: {
    // ── Auth ────────────────────────────────────────────
    signIn: async (_parent, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
      if (!user) throw new Error('Invalid credentials')
      const ok = await bcrypt.compare(password, user.passwordHash)
      if (!ok) throw new Error('Invalid credentials')
      return { token: makeToken(user), user }
    },

    signUp: async (_parent, { email, password, name }) => {
      const passwordHash = await bcrypt.hash(password, 10)
      try {
        const user = await prisma.user.create({
          data: { email: email.toLowerCase(), passwordHash, name: name ?? '' },
        })
        return { token: makeToken(user), user }
      } catch (err) {
        if (err.code === 'P2002') throw new Error('Email already in use')
        throw err
      }
    },

    // ── Product CRUD (admin only) ────────────────────────
    createProduct: async (_parent, { input }, context) => {
      requireAuth(context)
      const { name, price, originalPrice, imageUrl, images, sizes, category, featured, stock } = input
      const allImages = images?.length ? images : [imageUrl]
      const p = await prisma.product.create({
        data: {
          name, price,
          originalPrice: originalPrice ?? null,
          imageUrl,
          mediaUrls: JSON.stringify(allImages),
          sizes: sizes?.length ? JSON.stringify(sizes) : null,
          category,
          featured: featured ?? false,
          stock: stock ?? 0,
        },
      })
      return toProduct(p)
    },

    updateProduct: async (_parent, { id, input }, context) => {
      requireAuth(context)
      const { name, price, originalPrice, imageUrl, images, sizes, category, featured, stock } = input
      const allImages = images?.length ? images : [imageUrl]
      const p = await prisma.product.update({
        where: { id },
        data: {
          name, price,
          originalPrice: originalPrice ?? null,
          imageUrl,
          mediaUrls: JSON.stringify(allImages),
          sizes: sizes?.length ? JSON.stringify(sizes) : null,
          category,
          featured: featured ?? false,
          stock: stock ?? 0,
        },
      })
      return toProduct(p)
    },

    deleteProduct: async (_parent, { id }, context) => {
      requireAuth(context)
      await prisma.product.delete({ where: { id } })
      return true
    },

    // ── Orders ──────────────────────────────────────────
    createOrder: async (_parent, { input }) => {
      const {
        email, firstName, lastName, address, city, state, zip, country,
        subtotal, shipping, total, stripeCustomerId, stripePaymentId, items,
      } = input

      const order = await prisma.order.create({
        data: {
          email, firstName, lastName, address, city, state, zip, country,
          subtotal, shipping, total,
          stripeCustomerId: stripeCustomerId ?? null,
          stripePaymentId: stripePaymentId ?? null,
          status: 'paid',
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              qty: item.qty,
            })),
          },
        },
        include: { items: true },
      })

      return toOrder(order)
    },
  },
}
