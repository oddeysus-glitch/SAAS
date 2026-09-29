import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    log: ['query', 'error'],
  });

  try {
    const result = await prisma.$queryRawUnsafe<{ ok: number }[]>('SELECT 1 as ok');
    console.log('DB OK:', JSON.stringify(result));
  } catch (error) {
    console.error('DB FAIL:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
