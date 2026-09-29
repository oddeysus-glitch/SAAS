import Link from 'next/link';

export default function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ app?: string }>;
}) {
  return (
    <div className="max-width mx-auto mt-16 max-w-lg px-4 sm:px-6 lg:px-8 text-center">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2">Checkout canceled</h1>
        <p className="text-gray-600">
          No payment was made. You can try again whenever you are ready.
        </p>          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 no-underline"
            >
              Back to home
            </Link>
            <Link
              href="/account"
              className="inline-block rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 no-underline"
            >
              View account
            </Link>
          </div>
      </div>
    </div>
  );
}
