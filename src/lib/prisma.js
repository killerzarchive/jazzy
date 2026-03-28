import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

globalForPrisma.prisma ??= new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

export const prisma = globalForPrisma.prisma
