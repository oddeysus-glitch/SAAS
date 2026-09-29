'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toaster';

export function CreatorClient({ user }: { user: { id: string; email: string } }) {
  const router = useRouter();
  const toast = useToast();
  const [idea, setIdea] = useState('');
  const [format, setFormat] = useState<'social' | 'blog' | 'video'>('social');
  const [pack, setPack] = useState<Record<string, string> | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'exporting'>('idle');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  async function generatePack() {
    if (!idea.trim()) {
      setMessage('Enter an idea first.');
      return;
    }

    startTransition(async () => {
      setStatus('generating');
      setMessage(null);

      const res = await fetch('/api/creator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, format }),
      });

      const json = (await res.json()) as { pack?: Record<string, string>; error?: string };

      if (!res.ok) {
        setStatus('idle');
        setMessage(json.error ?? 'Generation failed.');
        return;
      }

      setPack(json.pack ?? {});
      setStatus('ready');
      toast.show('Content pack ready. Edit it, then pay to export.', 'success');
    });
  }

  async function exportPack() {
    startTransition(async () => {
      setStatus('exporting');
      const res = await fetch('/api/billing/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          app: 'creator',
          method: 'paypal',
          amount: 39,
        }),
      });

      const json = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setStatus('ready');
        toast.show(json.error ?? 'Request failed.', 'error');
        return;
      }

      toast.show('Access request sent. Pay with PayPal or Venmo, then come back and request access.', 'success');
      setStatus('ready');
    });
  }

  return (
    <div className="max-width mx-auto mt-8 max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-2">Content Creator Studio</h1>
        <p className="text-gray-600">
          Turn one idea into a content pack for social posts, blogs, or video scripts.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Start a pack</h2>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Idea</label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  rows={4}
                  placeholder="One idea, topic, product, or campaign."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'social' | 'blog' | 'video')}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="social">Social pack</option>
                  <option value="blog">Blog pack</option>
                  <option value="video">Video script pack</option>
                </select>
              </div>

              <button
                disabled={isPending || status === 'generating'}
                onClick={generatePack}
                className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                {status === 'generating' ? 'Generating...' : 'Generate content pack'}
              </button>

              {message && <p className="text-sm text-red-600">{message}</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[320px]">
            {status === 'idle' && !pack && (
              <div className="flex h-full items-center justify-center text-gray-400">
                <p className="text-sm">Your content pack will appear here.</p>
              </div>
            )}

            {status === 'generating' && (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                  <p className="text-sm text-gray-500">Building content pack...</p>
                </div>
              </div>
            )}

            {status === 'ready' && pack && (
              <div className="flex flex-col gap-4">
                {Object.entries(pack).map(([key, value]) => (
                  <div key={key} className="rounded-md border border-gray-200 p-4 text-sm">
                    <p className="font-medium text-gray-900 capitalize">{key}</p>
                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">{value}</p>
                  </div>
                ))}

                <button
                  onClick={exportPack}
                  className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
                >
                  Export content pack
                </button>
                <p className="text-sm text-gray-500">
                  Pay with PayPal or Venmo, then request access.
                </p>
              </div>
            )}

            {status === 'exporting' && (
              <div className="flex h-full items-center justify-center text-gray-500">
                <p className="text-sm">Opening access request...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
