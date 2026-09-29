'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface JobWithResult {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: string;
  app: string;
  input: string;
  metadata: string | null;
  errorMessage: string | null;
  creditsUsed: number;
  result?: {
    id: string;
    url: string | null;
  } | null;
}

export function AccountClient({
  user,
  balances,
  preview,
  recentJobs,
}: {
  user: { id: string; email: string; name?: string | null; image?: string | null };
  balances: { headshots: number; blogs: number };
  preview: { headshots?: number | null; blogs?: number | null } | null;
  recentJobs: JobWithResult[];
}) {
  const router = useRouter();

  return (
    <div className="max-width mx-auto mt-8 max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-1">Account</h1>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">What you can generate</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Paid headshot credits</span>
              <span className="font-medium">{balances.headshots}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paid blog credits</span>
              <span className="font-medium">{balances.blogs}</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            After you pay with PayPal or Venmo, request access from the billing page.
            We confirm the payment and unlock your credits.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Free preview left</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Headshot previews</span>
              <span className="font-medium">{preview?.headshots ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Blog previews</span>
              <span className="font-medium">{preview?.blogs ?? 0}</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Use a free preview to see the quality before you pay.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Recent jobs</h2>
        {recentJobs.length === 0 ? (
          <p className="text-sm text-gray-500">No jobs yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentJobs.map((job) => (
              <li key={job.id} className="py-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    {job.app === 'Headshots' ? 'Headshots' : 'Blogger'}
                  </span>
                  <span className="text-gray-500 capitalize">{job.status.toLowerCase()}</span>
                </div>
                {job.result?.url && (
                  <div className="mt-1">
                    <a
                      href={job.result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 no-underline hover:underline"
                    >
                      View result
                    </a>
                  </div>
                )}
                {job.errorMessage && (
                  <p className="mt-1 text-red-600">{job.errorMessage}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/headshots"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
        >
          Open headshots
        </Link>
        <Link
          href="/blogger"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
        >
          Open blogger
        </Link>
        <Link
          href="/billing"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
        >
          Pay for access
        </Link>
        <Link
          href="/support"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
        >
          Contact support
        </Link>
        <Link
          href="/analytics"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
        >
          View analytics
        </Link>
      </div>
    </div>
  );
}
