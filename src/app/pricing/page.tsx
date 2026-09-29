import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Pricing',
  description: 'Preview first. Pay for the result you want.',
};

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/pricing');
  }

  return (
    <div className="max-width mx-auto mt-8 max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2">Pricing</h1>
        <p className="text-gray-600">
          You get a free preview first. If you like it, pay for more.
        </p>
      </div>        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold">AI Headshot Generator</h2>
          <p className="text-sm text-gray-500 mb-4">
            Selfies to polished headshots
          </p>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <p className="font-medium">Free preview</p>
            <p className="text-gray-500 mt-1">
              One preview result when you start.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 text-sm">
            <p className="font-medium">Paid pack</p>
            <p className="text-gray-500 mt-1">
              Pay when you want more headshots.
            </p>
            <p className="mt-2 text-gray-600">
              Typical starting point: about $29 for a pack.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Pay with PayPal or Venmo, then come back to the app and request
            access. We confirm the payment and unlock your pack.
          </div>

          <div className="mt-4">
            <Link
              href="/billing?app=headshots"
              className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
            >
              Pay for headshots
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold">AI Blog Writer</h2>
          <p className="text-sm text-gray-500 mb-4">
            Drafts you can edit and export
          </p>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <p className="font-medium">Free preview</p>
            <p className="text-gray-500 mt-1">
              One preview draft when you start.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 text-sm">
            <p className="font-medium">Paid export</p>
            <p className="text-gray-500 mt-1">
              Pay to finish and export the article.
            </p>
            <p className="mt-2 text-gray-600">
              Typical starting point: about $19 per finished post.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Pay with PayPal or Venmo, then come back to the app and request
            access. We confirm the payment and unlock your export.
          </div>

          <div className="mt-4">
            <Link
              href="/billing?app=blogger"
              className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
            >
              Pay for blog export
            </Link>
          </div>
        </div>
      </div>        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
        <p className="font-medium text-gray-900">Other products on the platform</p>
        <ul className="mt-2 space-y-2 list-disc list-inside">
          <li>AI Wiki: notes and sources into a clean wiki.</li>
          <li>AI Influencer Studio: persona and content plan.</li>
          <li>Content Creator Studio: one idea into a content pack.</li>
          <li>Same account, same payment flow, same support.</li>
        </ul>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        Questions before you buy?{' '}
        <Link href="/support" className="text-brand-600 no-underline hover:underline">
          Contact support
        </Link>
      </div>
    </div>
  );
}
