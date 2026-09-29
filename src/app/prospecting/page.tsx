import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Prospecting',
  description: 'Owner view of the live products and outreach setup.',
};

export default async function ProspectingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/prospecting');
  }

  const products = [
    {
      name: 'AI Headshot Generator',
      url: '/headshots',
      offer: 'Free preview, then PayPal or Venmo for a paid pack.',
      audience: 'Professionals, job seekers, coaches, consultants, creators',
    },
    {
      name: 'AI Blog Writer',
      url: '/blogger',
      offer: 'Free preview draft, then PayPal or Venmo to finish and export.',
      audience: 'Founders, small businesses, marketers, creators',
    },
    {
      name: 'AI Wiki',
      url: '/wiki',
      offer: 'Turn notes and sources into a clean wiki. Pay to export.',
      audience: 'Creators, founders, researchers, small teams',
    },
    {
      name: 'AI Influencer Studio',
      url: '/influencer',
      offer: 'Build a persona and content plan. Pay to export the pack.',
      audience: 'Creators, agencies, brand builders',
    },
    {
      name: 'Content Creator Studio',
      url: '/creator',
      offer: 'Turn one idea into a multi-format content pack. Pay to export.',
      audience: 'Creators, marketers, small businesses',
    },
  ];

  return (
    <div className="max-width mx-auto mt-8 max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-1">Prospecting</h1>
        <p className="text-sm text-gray-500">
          Owner view of the live products and how to sell them.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {products.map((product) => (
          <div key={product.name} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Live
              </span>
              <span className="text-xs text-gray-500">{product.url}</span>
            </div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-2 text-sm text-gray-600">{product.offer}</p>
            <p className="mt-3 text-sm text-gray-500">
              Best first audience: {product.audience}
            </p>
            <div className="mt-3">
              <Link
                href={product.url}
                className="inline-block rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
              >
                Open product
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
        <p className="font-medium text-gray-900">Simple sales loop</p>
        <ol className="mt-2 space-y-2 list-decimal list-inside">
          <li>Pick one audience first.</li>
          <li>Show the result, not the tool.</li>
          <li>Offer a free preview.</li>
          <li>Let them pay with PayPal or Venmo.</li>
          <li>Deliver the result fast.</li>
          <li>Ask for a repeat purchase or referral.</li>
        </ol>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin"
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
        >
          Admin
        </Link>
        <Link
          href="/analytics"
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
        >
          Analytics
        </Link>
        <Link
          href="/support"
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
        >
          Support
        </Link>
        <Link
          href="/platform"
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
        >
          Platform
        </Link>
        <Link
          href="/"
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
