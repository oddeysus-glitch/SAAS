const { PrismaClient } = require('@prisma/client');

const { DIRECT_URL, DATABASE_URL } = process.env;

(async () => {
  const p = new PrismaClient({
    datasources: {
      db: {
        url: DIRECT_URL ?? DATABASE_URL,
      },
    },
  });
  try {
    const r = await p.$queryRawUnsafe('SELECT 1 as ok');
    console.log('DB OK:', JSON.stringify(r));
  } catch (e) {
    console.log('DB FAIL:', e.message);
    process.exitCode = 1;
  } finally {
    await p.$disconnect();
  }
})();
