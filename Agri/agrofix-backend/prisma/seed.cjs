const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Wheat',
        description: 'High-quality wheat grains, ideal for chapati and bread.',
        price: 24,
        stock: 500,
        imageUrl: 'https://img.icons8.com/color/96/000000/wheat.png',
      },
      {
        name: 'Rice',
        description: 'Premium rice, perfect for daily meals and biryani.',
        price: 32,
        stock: 400,
        imageUrl: 'https://img.icons8.com/color/96/000000/rice-bowl.png',
      },
      {
        name: 'Tomato',
        description: 'Fresh tomatoes, juicy and perfect for salads and curries.',
        price: 16,
        stock: 350,
        imageUrl: 'https://img.icons8.com/color/96/000000/tomato.png',
      },
      {
        name: 'Potato',
        description: 'Farm-fresh potatoes, great for all cooking needs.',
        price: 12,
        stock: 600,
        imageUrl: 'https://img.icons8.com/color/96/000000/potato.png',
      },
      {
        name: 'Onion',
        description: 'Crisp onions, essential for Indian cuisine.',
        price: 18,
        stock: 450,
        imageUrl: 'https://img.icons8.com/color/96/000000/onion.png',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Seeded products!');

  // Seed admin user
  await prisma.user.create({
    data: {
      email: "admin@agrofix.com",
      password: "admin123", // plain text for now
      name: "Admin",
      role: "admin"
    },
  });
  console.log('Seeded admin user!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
