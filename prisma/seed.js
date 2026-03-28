const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      name: '9060 "Black Castlerock" NB',
      price: 130.00,
      originalPrice: 200.00,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=500&fit=crop',
      category: 'footwear',
      featured: true,
      stock: 12,
    },
    {
      name: '9060 "Black/White" NB',
      price: 150.00,
      originalPrice: 220.00,
      imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=500&fit=crop',
      category: 'footwear',
      featured: true,
      stock: 8,
    },
    {
      name: '9060 "Red/Black" NB',
      price: 150.00,
      originalPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=500&fit=crop',
      category: 'footwear',
      featured: true,
      stock: 5,
    },
    {
      name: '9060 "Cream/Brown" NB',
      price: 150.00,
      originalPrice: 210.00,
      imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=500&fit=crop',
      category: 'footwear',
      featured: true,
      stock: 10,
    },
    {
      name: '9060 "Pink Overdye" NB',
      price: 150.00,
      originalPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=500&fit=crop',
      category: 'footwear',
      featured: false,
      stock: 7,
    },
    {
      name: '9060 "Warped Multi-Color" NB',
      price: 150.00,
      originalPrice: 190.00,
      imageUrl: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&h=500&fit=crop',
      category: 'footwear',
      featured: false,
      stock: 6,
    },
    {
      name: 'AirPods Pro (2nd Gen)',
      price: 189.00,
      originalPrice: 249.00,
      imageUrl: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=600&h=500&fit=crop',
      category: 'electronics',
      featured: true,
      stock: 15,
    },
    {
      name: 'AirPods Max',
      price: 299.00,
      originalPrice: 549.00,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=500&fit=crop',
      category: 'electronics',
      featured: true,
      stock: 9,
    },
    {
      name: 'Custom Hello Kitty Rug',
      price: 85.00,
      originalPrice: 190.00,
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=500&fit=crop',
      category: 'rugs',
      featured: true,
      stock: 4,
    },
    {
      name: 'Custom Floral Rug',
      price: 95.00,
      originalPrice: 257.00,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=500&fit=crop',
      category: 'rugs',
      featured: true,
      stock: 3,
    },
  ]

  // Clear existing products and re-seed
  await prisma.product.deleteMany({})
  await prisma.product.createMany({ data: products })

  console.log(`Seeded ${products.length} products`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
