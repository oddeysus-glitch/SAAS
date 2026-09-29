import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreatorClient } from './creator-client';

export const metadata = {
  title: 'Content Creator Studio',
  description: 'Turn one idea into posts, scripts, captions, and a content plan.',
};

export default async function CreatorPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/creator');
  }

  return <CreatorClient user={session.user} />;
}
