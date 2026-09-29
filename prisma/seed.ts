import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const app = process.env.NODE_ENV !== 'production' ? '(dev)' : '';

  console.log(`Plans seed is intentionally empty until you add real payment plans.${app}`);

  console.log('If you are using PayPal/Venmo, you do not need Stripe plans to start.');
  console.log('If you are using Stripe later, add plans here.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
