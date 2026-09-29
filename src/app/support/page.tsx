import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SupportClient } from './support-client';

export default async function SupportPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/support');
  }

  return <SupportClient userId={session.user.id} />;
}
