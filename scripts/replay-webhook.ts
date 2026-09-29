import { PrismaClient } from '@prisma/client';
import { grantCredits } from '../src/lib/credits';

const prisma = new PrismaClient();

async function main() {
  const userId = process.env.TEST_USER_ID;
  if (!userId) {
    console.error('Set TEST_USER_ID to replay a webhook for a real user.');
    process.exit(1);
  }

  const app = process.env.TEST_APP ?? 'headshots';

  if (app !== 'headshots' && app !== 'blogger') {
    console.error('TEST_APP must be headshots or blogger.');
    process.exit(1);
  }

  const credits =
    app === 'headshots' ? 'Headshots' : 'BlogPosts';

  const balance = await grantCredits(
    userId,
    credits as 'Headshots' | 'BlogPosts',
    1,
    `manual_replay:${app}`,
    `replay-session-${Date.now()}`,
    `replay-pi-${Date.now()}`
  );

  console.log('Granted 1 credit. New balance:', balance);
}
main().finally(async () => {
  await prisma.$disconnect();
});
