'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toaster';

export function WikiClient({ user }: { user: { id: string; email: string } }) {
  const router = useRouter();
  const toast = useToast();
  const [sources, setSources] = useState('');
  const [generated, setGenerated] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'exporting'>('idle');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  async function generateWiki() {
    if (!sources.trim()) {
      setMessage('Add at least one source, link, or note first.');
      return;
    }

    startTransition(async () => {
      setStatus('generating');
      setMessage(null);

      const res = await fetch('/api/wiki/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources }),
      });

      const json = (await res.json()) as { html?: string; error?: string };

      if (!res.ok) {
        setStatus('idle');
        setMessage(json.error ?? 'Generation failed.');
        return;
      }

      setDraft(json.html ?? '<p>No content generated.</p>');
      setGenerated(true);
      setStatus('ready');
      toast.show('Wiki draft ready. Edit it, then pay to export.', 'success');
    });
  }

  async function exportWiki() {
    startTransition(async () => {
      setStatus('exporting');
      const res = await fetch('/api/billing/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          app: 'wiki',
          method: 'paypal',
          amount: 29,
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
        <h1 className="mb-2">AI Wiki</h1>
        <p className="text-gray-600">
          Turn scattered notes, links, and sources into a clean wiki format.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Start a wiki</h2>
            <textarea
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              placeholder="Paste notes, links, bullet points, or rough source material here."
              className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={6}
            />
            <button
              disabled={isPending || !sources.trim()}
              onClick={generateWiki}
              className="mt-3 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {isPending || status === 'generating' ? 'Generating...' : 'Generate wiki draft'}
            </button>
            {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900">What this does</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Takes rough sources and turns them into a structured wiki.</li>
              <li>Creates sections, summaries, and links between ideas.</li>
              <li>Gives you a draft you can edit before exporting.</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[320px]">
            {status === 'idle' && !generated && (
              <div className="flex h-full items-center justify-center text-gray-400">
                <p className="text-sm">Your wiki draft will appear here.</p>
              </div>
            )}

            {status === 'generating' && (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                  <p className="text-sm text-gray-500">Building wiki structure...</p>
                </div>
              </div>
            )}

            {status === 'ready' && draft && (
              <div className="flex flex-col gap-4">
                <div
                  className="max-h-[420px] overflow-y-auto rounded-md border border-gray-200 p-4 text-sm"
                  dangerouslySetInnerHTML={{ __html: draft }}
                />
                <button
                  onClick={exportWiki}
                  className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
                >
                  Export wiki
                </button>
                <p className="text-sm text-gray-500">
                  Pay with PayPal or Venmo, then request access to export.
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
