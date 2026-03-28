import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const { Pool } = pg

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

pool.on('error', (err) => {
  console.error('Postgres pool error:', err.message)
})

export default pool
