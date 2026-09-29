import Link from 'next/link';
import { pickCopy } from '@/lib/copy';

export function BloggerCard({ user }: { user: { id?: string; email?: string | null } | null }) {
  const copy = pickCopy('blogger', 0);

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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Blog Writer</h2>
            <p className="text-sm text-gray-500">Posts you can publish, not just drafts</p>
          </div>
        </div>

        <p className="mb-2 text-gray-700">{copy.subhead}</p>

        <p className="mb-4 text-sm text-gray-500">
          Preview one free · Paid exports from $19
        </p>

        <ul className="mb-6 space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-600">✓</span>
            <span>See a draft before you pay.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-600">✓</span>
            <span>Edit it in the editor.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-600">✓</span>
            <span>Pay to export the finished post.</span>
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
              href="/blogger"
              className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
            >
              Write my post
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
  );
}
