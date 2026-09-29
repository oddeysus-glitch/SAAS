'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toaster';

const HEADSHOT_AMOUNT = 29;
const BLOGGER_AMOUNT = 19;

export function BillingClient({
  user,
  defaultApp,
}: {
  user: { id: string; email: string };
  defaultApp: 'headshots' | 'blogger';
}) {
  const router = useRouter();
  const toast = useToast();
  const [app, setApp] = useState<'headshots' | 'blogger'>(defaultApp);
  const [method, setMethod] = useState<'paypal' | 'venmo'>('paypal');
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const amount =
    app === 'headshots' ? HEADSHOT_AMOUNT : BLOGGER_AMOUNT;

  function openPayPal() {
    // Replace with your real PayPal payment link.
    const url =
      process.env.NEXT_PUBLIC_PAYPAL_URL ??
      'https://www.paypal.com';
    window.location.href = url;
  }

  function openVenmo() {
    // Replace with your real Venmo handle or payment link.
    const handle =
      process.env.NEXT_PUBLIC_VENMO_HANDLE ?? 'your-venmo-handle';
    window.location.href = `https://venmo.com/${encodeURIComponent(handle)}`;
  }

  async function requestAccess() {
    if (requested) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/billing/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          app,
          method,
          amount,
        }),
      });

      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok) {
        setMessage(json.error ?? 'Request failed.');
        setLoading(false);
        return;
      }

      setRequested(true);
      toast.show('Access request sent. We will check it and unlock your result.', 'success');
      setMessage('Request received. Please allow some time for confirmation.');
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-width mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-2">Pay for access</h1>
        <p className="text-gray-600">
          Choose what you want, pay outside the app, then request access.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            What do you want to pay for?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setApp('headshots')}
              className={`flex-1 rounded-md border px-4 py-2 text-sm transition ${
                app === 'headshots'
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Headshot pack
            </button>
            <button
              type="button"
              onClick={() => setApp('blogger')}
              className={`flex-1 rounded-md border px-4 py-2 text-sm transition ${
                app === 'blogger'
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Blog export
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            How do you want to pay?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMethod('paypal')}
              className={`flex-1 rounded-md border px-4 py-2 text-sm transition ${
                method === 'paypal'
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              PayPal
            </button>
            <button
              type="button"
              onClick={() => setMethod('venmo')}
              className={`flex-1 rounded-md border px-4 py-2 text-sm transition ${
                method === 'venmo'
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Venmo
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
          <p className="font-medium">Amount: ${amount}</p>
          <p className="text-gray-500 mt-1">
            {app === 'headshots'
              ? 'Pay for a headshot pack, then request access.'
              : 'Pay to finish and export the blog post.'}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              if (method === 'paypal') {
                openPayPal();
              } else {
                openVenmo();
              }
            }}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {method === 'paypal' ? 'Pay with PayPal' : 'Pay with Venmo'}
          </button>

          {!requested ? (
            <button
              type="button"
              disabled={loading}
              onClick={requestAccess}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? 'Sending request...' : 'I paid — request access'}
            </button>
          ) : (
            <p className="text-sm text-gray-600">{message}</p>
          )}
        </div>

        {message && !requested && (
          <p className="mt-2 text-sm text-red-600">{message}</p>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-900">What to do next</p>
        <ol className="mt-2 space-y-1 list-decimal list-inside">
          <li>Choose what you want.</li>
          <li>Pay with PayPal or Venmo.</li>
          <li>Return here and click “I paid — request access.”</li>
          <li>We confirm the payment and unlock your result.</li>
        </ol>
      </div>

      <div className="mt-6">
        <a
          href="/account"
          className="text-sm text-brand-600 no-underline hover:underline"
        >
          Back to account
        </a>
      </div>
    </div>
  );
}
