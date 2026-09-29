'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BillingRequest {
  id: string;
  createdAt: Date;
  properties: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface PayoutRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  app: string;
  amount: number;
  status: string;
  note: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

type AdminRequest = BillingRequest | PayoutRequest;

function parseBilling(request: BillingRequest) {
  let app: 'headshots' | 'blogger' = 'headshots';
  let method: string = 'unknown';
  let amount = 0;

  try {
    const parsed = JSON.parse(request.properties);
    app = parsed.app === 'blogger' ? 'blogger' : 'headshots';
    method = parsed.method ?? 'unknown';
    amount = Number(parsed.amount) || 0;
  } catch {
    // leave defaults
  }

  return { app, method, amount };
}

export function AdminClient({
  requests,
}: {
  requests: AdminRequest[];
}) {
  const router = useRouter();
  const [granting, setGranting] = useState<string | null>(null);

  async function grant(
    userId: string,
    app: 'headshots' | 'blogger',
    amount: number,
    payoutId?: string
  ) {
    setGranting(userId);

    try {
      const res = await fetch('/api/billing/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          app,
          amount,
          recordPayoutRequest: false,
          ...(payoutId ? { note: `payout:${payoutId}` } : {}),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Grant failed');
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setGranting(null);
    }
  }

  return (
    <div className="max-width mx-auto mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-1">Admin</h1>
        <p className="text-sm text-gray-500">
          Confirm payments and grant access.
        </p>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-gray-500">No requests yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {requests.map((request) => {
            if ('properties' in request) {
              const { app, method, amount } = parseBilling(request);

              return (
                <li key={request.id} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.user.email}
                      </p>
                      <p className="text-gray-500">
                        {request.createdAt.toLocaleString()}

                        {' · '}
                        {app}

                        {' · '}
                        {method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {amount > 0 ? `$${amount}` : 'unknown'}
                      </p>
                      <p className="text-gray-500">
                        {app === 'blogger' ? 'blog export' : 'headshots'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <button
                      disabled={granting === request.user.id}
                      onClick={() =>
                        grant(
                          request.user.id,
                          app,
                          amount || 1
                        )
                      }
                      className="rounded-md bg-brand-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
                    >
                      {granting === request.user.id
                        ? 'Granting...'
                        : `Grant ${app === 'blogger' ? 'export' : 'pack'}`}
                    </button>
                  </div>
                </li>
              );
            }

            return (
              <li key={request.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">
                      {request.user.email}
                    </p>
                    <p className="text-gray-500">
                      {request.createdAt.toLocaleString()}

                      {' · '}
                      {request.app}

                      {' · '}
                      {request.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${request.amount}</p>
                    <p className="text-gray-500">
                      payout request
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex gap-2">
                  <button
                    disabled={granting === request.user.id}
                    onClick={() =>
                      grant(
                        request.user.id,
                        request.app as 'headshots' | 'blogger',
                        request.amount,
                        request.id
                      )
                    }
                    className="rounded-md bg-brand-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
                  >
                    {granting === request.user.id
                      ? 'Granting...'
                      : 'Grant access'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-900">How to use this</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Wait for a buyer to pay and request access.</li>
          <li>Check the email and amount.</li>
          <li>Confirm the payment on your side.</li>
          <li>Click Grant to unlock the credits.</li>
        </ul>
      </div>
    </div>
  );
}
