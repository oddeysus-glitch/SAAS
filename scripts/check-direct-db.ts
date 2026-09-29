import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['error'],
  });

  try {
    const result = await prisma.$queryRawUnsafe`SELECT 1 as ok`;
    console.log('DB OK:', JSON.stringify(result));
  } catch (err: any) {
    console.log('DB FAIL:', err.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
