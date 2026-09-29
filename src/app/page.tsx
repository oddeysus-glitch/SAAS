import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { HeadshotsCard } from '@/components/home/headshots-card';
import { BloggerCard } from '@/components/home/blogger-card';

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'AI SaaS Platform',
  description:
    'Turn selfies into polished headshots, or turn ideas into publishable blog posts. Preview before you pay.',
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-width py-12 sm:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-2">
          Turn selfies into polished headshots, or ideas into publishable blog posts.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Preview first. Pay with PayPal or Venmo when you want the paid result.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <HeadshotsCard user={session?.user ?? null} />
        <BloggerCard user={session?.user ?? null} />
      </div>

      <div className="mt-16 border-t border-gray-200 pt-10 text-center text-sm text-gray-500">
        <p>
          Use your Google account to start. Each app gives you a free preview so
          you can see the quality before you pay for more.
        </p>
        <p className="mt-2">
          <Link
            href="/billing"
            className="text-brand-600 no-underline hover:underline"
          >
            Pay for access
          </Link>{' '}
          ·{' '}
          <Link
            href="/support"
            className="text-brand-600 no-underline hover:underline"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
