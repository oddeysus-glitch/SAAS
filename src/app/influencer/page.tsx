import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { InfluencerClient } from './influencer-client';

export const metadata = {
  title: 'AI Influencer Studio',
  description: 'Create a consistent influencer persona, content ideas, and a starter content pack.',
};

export default async function InfluencerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/influencer');
  }

  return <InfluencerClient user={session.user} />;
}
