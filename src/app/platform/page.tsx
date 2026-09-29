import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'AI Product Platform',
  description:
    'One account for AI tools you can use and buy. Start with headshots or blog posts.',
};

export default async function PlatformPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-width py-12 sm:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-2">One platform. Several AI products.</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Start with one product. Keep your account. Add more later.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Live
            </span>
            <h2 className="text-lg font-semibold">AI Headshot Generator</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Turn selfies into polished headshots. Preview one for free, then
            pay with PayPal or Venmo if you want more.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="text-brand-600">•</span> Free preview first
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-600">•</span> Pay only when you want the paid pack
            </p>
          </div>
          <div className="mt-4">
            {session ? (
              <Link
                href="/headshots"
                className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
              >
                Open headshots
              </Link>
            ) : (
              <Link
                href="/auth/signin?callbackUrl=/headshots"
                className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
              >
                Start free preview
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Live
            </span>
            <h2 className="text-lg font-semibold">AI Blog Writer</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Turn ideas into publishable blog posts. Preview one draft for free,
            then pay with PayPal or Venmo to finish and export.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="text-brand-600">•</span> Free preview first
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-600">•</span> Pay to finish and export
            </p>
          </div>
          <div className="mt-4">
            {session ? (
              <Link
                href="/blogger"
                className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
              >
                Open blog writer
              </Link>
            ) : (
              <Link
                href="/auth/signin?callbackUrl=/blogger"
                className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
              >
                Start free preview
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Live
            </span>
            <h2 className="text-lg font-semibold">AI Wiki</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Turn notes, links, and rough sources into a clean wiki format.
            Preview first, then pay to export.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="text-brand-600">•</span> Free preview first
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-600">•</span> Pay to export the wiki
            </p>
          </div>
          <div className="mt-4">
            {session ? (
              <Link
                href="/wiki"
                className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
              >
                Open wiki
              </Link>
            ) : (
              <Link
                href="/auth/signin?callbackUrl=/wiki"
                className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
              >
                Start free preview
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Live
            </span>
            <h2 className="text-lg font-semibold">AI Influencer Studio</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Build a consistent influencer persona and generate a content plan
            around it. Pay to export the pack.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="text-brand-600">•</span> Persona + content ideas
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-600">•</span> Pay to export the pack
            </p>
          </div>
          <div className="mt-4">
            {session ? (
              <Link
                href="/influencer"
                className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
              >
                Open influencer studio
              </Link>
            ) : (
              <Link
                href="/auth/signin?callbackUrl=/influencer"
                className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
              >
                Start free preview
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Live
            </span>
            <h2 className="text-lg font-semibold">Content Creator Studio</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Turn one idea into a content pack for social posts, blogs, or video
            scripts. Pay to export.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="text-brand-600">•</span> Multi-format content pack
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-600">•</span> Pay to export
            </p>
          </div>
          <div className="mt-4">
            {session ? (
              <Link
                href="/creator"
                className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
              >
                Open creator studio
              </Link>
            ) : (
              <Link
                href="/auth/signin?callbackUrl=/creator"
                className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
              >
                Start free preview
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
        <p className="font-medium text-gray-900">How this platform works</p>
        <ol className="mt-2 space-y-2 list-decimal list-inside">
          <li>Sign in with one account.</li>
          <li>Try a free preview in any live product.</li>
          <li>Pay with PayPal or Venmo when you want more.</li>
          <li>Request access after payment.</li>
          <li>Use the same account across products.</li>
        </ol>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/pricing"
          className="text-brand-600 no-underline hover:underline"
        >
          View pricing
        </Link>
        {' · '}
        <Link
          href="/billing"
          className="text-brand-600 no-underline hover:underline"
        >
          Pay for access
        </Link>
        {' · '}
        <Link
          href="/support"
          className="text-brand-600 no-underline hover:underline"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}
