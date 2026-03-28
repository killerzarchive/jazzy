import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET /api/products
router.get('/', async (req, res) => {
  const { category } = req.query
  try {
    const query = category && category !== 'all'
      ? 'SELECT * FROM products WHERE category = $1 ORDER BY featured DESC, id ASC'
      : 'SELECT * FROM products ORDER BY featured DESC, id ASC'
    const params = category && category !== 'all' ? [category] : []
    const { rows } = await pool.query(query, params)
    // Normalise column names to match frontend shape
    res.json(rows.map((r) => ({
      id: r.id,
      name: r.name,
      price: parseFloat(r.price),
      category: r.category,
      image: r.image_url,
      featured: r.featured,
    })))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    const r = rows[0]
    res.json({ id: r.id, name: r.name, price: parseFloat(r.price), category: r.category, image: r.image_url, featured: r.featured })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
