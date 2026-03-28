import { Router } from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// All cart routes require auth
router.use(requireAuth)

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.image_url AS image, p.category
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1`,
      [req.user.id]
    )
    res.json(rows.map((r) => ({ ...r, price: parseFloat(r.price) })))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/cart
router.post('/', async (req, res) => {
  const { productId, quantity = 1 } = req.body
  if (!productId) return res.status(400).json({ error: 'productId required' })
  try {
    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $3`,
      [req.user.id, productId, quantity]
    )
    const { rows } = await pool.query(
      'SELECT SUM(quantity)::int AS count FROM cart_items WHERE user_id = $1',
      [req.user.id]
    )
    res.json({ cartCount: rows[0].count })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/cart/:id
router.put('/:id', async (req, res) => {
  const { quantity } = req.body
  if (!quantity || quantity < 1) return res.status(400).json({ error: 'Invalid quantity' })
  try {
    await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3',
      [quantity, req.params.id, req.user.id]
    )
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/cart/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
