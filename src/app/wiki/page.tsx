import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { WikiClient } from './wiki-client';

export const metadata = {
  title: 'AI Wiki',
  description: 'Turn notes, links, and sources into a clean wiki you can use and update.',
};

export default async function WikiPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/wiki');
  }

  return <WikiClient user={session.user} />;
}
