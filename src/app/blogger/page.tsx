import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { BloggerClient } from './blogger-client';

export default async function BloggerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/blogger');
  }

  return <BloggerClient user={session.user} />;
}
