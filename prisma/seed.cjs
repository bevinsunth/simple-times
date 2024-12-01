const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const testUser = await prisma.user.create({
    data: {
      name: 'Simple User',
      email: 'simple@example.com',
      id: '00000000-0000-0000-0000-000000000000',
      // You may want to hash the password if you have a password field
      // For testing, you can use a simple password
      // password: 'testpassword', // Uncomment if you have a password field
    },
  });

  console.log({ testUser });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
