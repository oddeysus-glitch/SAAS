import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { HeaderAuth } from './header-auth';

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold text-gray-900 no-underline"
          >
            AI SaaS Platform
          </Link>

          <HeaderAuth session={session} />
        </div>
      </div>
    </header>
  );
}
