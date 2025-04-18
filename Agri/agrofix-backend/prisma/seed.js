const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Wheat',
        price: 24,
        stock: 500,
        imageUrl: 'https://img.icons8.com/color/96/000000/wheat.png',
      },
      {
        name: 'Rice',
        price: 32,
        stock: 400,
        imageUrl: 'https://img.icons8.com/color/96/000000/rice-bowl.png',
      },
      {
        name: 'Tomato',
        price: 16,
        stock: 350,
        imageUrl: 'https://img.icons8.com/color/96/000000/tomato.png',
      },
      {
        name: 'Potato',
        price: 12,
        stock: 600,
        imageUrl: 'https://img.icons8.com/color/96/000000/potato.png',
      },
      {
        name: 'Onion',
        price: 18,
        stock: 450,
        imageUrl: 'https://img.icons8.com/color/96/000000/onion.png',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Seeded products!');

  // Add admin user seed
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'admin123', // Plain text for demo; use hashed in production
      role: 'admin',
    },
  });
  console.log('Seeded admin user!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
