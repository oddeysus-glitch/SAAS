import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; app?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  if (!session) {
    redirect('/auth/signin?callbackUrl=/checkout/success');
  }

  const app = params.app === 'blogger' ? 'Blogger CMS' : 'AI Headshot Generator';

  return (
    <div className="max-width mx-auto mt-16 max-w-lg px-4 sm:px-6 lg:px-8 text-center">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mb-2">Payment received</h1>
        <p className="mb-2 text-gray-600">
          Thanks for your purchase. Your credits are being applied now.
        </p>
        <p className="text-sm text-gray-500">
          Next step: use your credits in the app. If something looks wrong, contact
          support and we will check it.
        </p>

        <div className="mt-6 flex gap-3 justify-center">
          <Link
            href={params.app === 'blogger' ? '/blogger' : '/headshots'}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
          >
            Continue to {app}
          </Link>
          <Link
            href="/account"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
          >
            View account
          </Link>
        </div>
      </div>
    </div>
  );
}
