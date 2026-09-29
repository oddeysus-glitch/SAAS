'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function HeaderAuth({ session }: { session: Awaited<ReturnType<typeof import('next-auth').getServerSession>> }) {
  return <HeaderAuthClient session={session} />;
}

function HeaderAuthClient({ session }: { session: Awaited<ReturnType<typeof import('next-auth').getServerSession>> }) {
  const { data } = useSession();

  if (!data) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/signin"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/account"
        className="text-sm text-gray-600 no-underline hover:text-gray-900"
      >
        Account
      </Link>
      <Link
        href="/pricing"
        className="text-sm text-gray-600 no-underline hover:text-gray-900"
      >
        Pricing
      </Link>
      <Link
        href="/platform"
        className="text-sm text-gray-600 no-underline hover:text-gray-900"
      >
        Platform
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
      >
        Sign out
      </button>
    </div>
  );
}
