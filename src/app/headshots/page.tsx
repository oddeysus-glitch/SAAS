import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { HeadshotsClient } from './headshots-client';

export default async function HeadshotsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/headshots');
  }

  return <HeadshotsClient user={session.user} />;
}
