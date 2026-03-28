// Run with: node scripts/create-admin.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { createInterface } = require('readline')

const prisma = new PrismaClient()

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((res) => rl.question(q, res))

async function main() {
  console.log('\n── Create Admin Account ──\n')

  const email    = await ask('Email: ')
  const password = await ask('Password: ')
  const name     = await ask('Name (optional, press enter to skip): ')

  rl.close()

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) {
    console.log('\n⚠  A user with that email already exists.')
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email: email.toLowerCase(), passwordHash, name: name || 'Admin' },
  })

  console.log(`\n✓ Admin created  →  id: ${user.id}  |  email: ${user.email}\n`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
