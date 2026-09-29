import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { AdminClient } from './admin-client';

export const metadata = {
  title: 'Admin',
  description: 'Confirm payments and grant access.',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  const billingRequests = await prisma.billingRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
    },
  });

  const payoutRequests = await prisma.payoutRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
    },
  });

  const requests: Array<
    | { id: string; createdAt: Date; properties: string; user: { id: string; email: string; name: string | null } }
    | { id: string; createdAt: Date; updatedAt: Date; app: string; amount: number; status: string; note: string | null; user: { id: string; email: string; name: string | null } }
  > = [
    ...billingRequests,
    ...payoutRequests,
  ];

  return <AdminClient requests={requests} />;
}

