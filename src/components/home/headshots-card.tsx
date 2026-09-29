import Link from 'next/link';
import { pickCopy } from '@/lib/copy';

export function HeadshotsCard({ user }: { user: { id?: string; email?: string | null } | null }) {
  const copy = pickCopy('headshots', 0);

  return (      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Headshot Generator</h2>
            <p className="text-sm text-gray-500">Professional photos from your selfies</p>
          </div>
        </div>

        <p className="mb-2 text-gray-700">{copy.subhead}</p>

        <p className="mb-4 text-sm text-gray-500">
          Preview one free · Paid packs from $29
        </p>

        <ul className="mb-6 space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-600">✓</span>
            <span>See one result before you pay.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-600">✓</span>
            <span>Buy a pack only when you want more.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-600">✓</span>
            <span>Download the photos you keep.</span>
          </li>
        </ul>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            {user
              ? 'You have a preview left. Open the app to use it.'
              : 'Free preview available after sign in.'}
          </p>
          {user ? (
            <Link
              href="/headshots"
              className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
            >
              Make my headshots
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
  );
}
