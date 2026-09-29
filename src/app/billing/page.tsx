import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { BillingClient } from './billing-client';

export const metadata = {
  title: 'Pay for access',
  description: 'Pay with PayPal or Venmo, then request access.',
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ app?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  if (!session) {
    redirect('/auth/signin?callbackUrl=/billing');
  }

  const app = params.app === 'blogger' ? 'blogger' : 'headshots';

  return <BillingClient user={session.user} defaultApp={app} />;
}
