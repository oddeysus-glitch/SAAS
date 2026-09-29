import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const headshots = await prisma.plan.upsert({
    where: { priceId: process.env.STRIPE_HEADSHOT_PRICE_ID ?? 'headshots-base' },
    update: {},
    create: {
      name: 'Headshot Pack',
      app: 'Headshots',
      priceId: process.env.STRIPE_HEADSHOT_PRICE_ID ?? 'headshots-base',
      amount: 2900,
      credits: 1,
      metadata: JSON.stringify({
        'pack description': '1 paid pack unlocks a full headshot pack via the app flow.',
      }),
    },
  });

  const blogger = await prisma.plan.upsert({
    where: { priceId: process.env.STRIPE_BLOGGER_PRICE_ID ?? 'blogger-base' },
    update: {},
    create: {
      name: 'Blog Post Export',
      app: 'Blogger',
      priceId: process.env.STRIPE_BLOGGER_PRICE_ID ?? 'blogger-base',
      amount: 1900,
      credits: 1,
      metadata: JSON.stringify({
        'pack description': '1 paid export unlocks a finished article.',
      }),
    },
  });

  console.log('Seeded plans:');
  console.log(JSON.stringify({ headshots, blogger }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
