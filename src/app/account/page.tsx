import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { AccountClient } from './account-client';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/account');
  }

  const userId = session.user.id;
  const [headshotBalance, blogBalance, preview, recentJobs] = await Promise.all([
    (async () => {
      const rows = await prisma.creditLedger.findMany({
        where: { userId, type: 'Headshots' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });
      return rows[0]?.balance ?? 0;
    })(),
    (async () => {
      const rows = await prisma.creditLedger.findMany({
        where: { userId, type: 'BlogPosts' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });
      return rows[0]?.balance ?? 0;
    })(),
    prisma.previewCount.findUnique({ where: { userId } }),
    prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { result: true },
    }),
  ]);

  return (
    <AccountClient
      user={session.user}
      balances={{ headshots: headshotBalance ?? 0, blogs: blogBalance ?? 0 }}
      preview={preview}
      recentJobs={recentJobs}
    />
  );
}

