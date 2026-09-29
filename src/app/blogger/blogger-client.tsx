'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toaster';
import { pickCopy } from '@/lib/copy';

type DraftState = {
  title: string;
  outline: string;
  body: string;
};

type GenerationStatus = 'idle' | 'generating' | 'ready' | 'exporting' | 'exported' | 'failed';

export function BloggerClient({ user }: { user: { id: string; previewBlogs: number } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [topic, setTopic] = useState('');
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const copy = pickCopy('blogger', 0);

  const remainingPreviews = typeof user.previewBlogs === 'number' ? user.previewBlogs : 0;

  async function generateDraft() {
    if (!topic.trim()) {
      setMessage('Enter a topic first.');
      return;
    }

    startTransition(async () => {
      setStatus('generating');
      setMessage(null);

      const res = await fetch('/api/blogger/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const json = (await res.json()) as {
        title?: string;
        outline?: string;
        body?: string;
        error?: string;
        isPreview?: boolean;
      };

      if (!res.ok) {
        setStatus('failed');
        setMessage(json.error ?? 'Generation failed.');
        return;
      }

      setDraft({
        title: json.title ?? 'Untitled',
        outline: json.outline ?? '',
        body: json.body ?? '',
      });
      setStatus('ready');
      toast.show('Preview draft ready. Edit it, then pay to export.', 'success');
    });
  }

  async function exportDraft() {
    if (!draft) {
      return;
    }

    startTransition(async () => {
      setStatus('exporting');
      setMessage(null);

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: 'blogger' }),
      });

      const json = (await res.json()) as { url?: string; error?: string };

      if (!res.ok) {
        setStatus('ready');
        toast.show(json.error ?? 'Could not start checkout.', 'error');
        return;
      }

      if (json.url) {
        window.location.href = json.url;
      } else {
        setStatus('ready');
      }
    });
  }

  return (
    <div className="max-width mx-auto mt-8 max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-2">{copy.headline}</h1>
        <p className="text-gray-600">{copy.subhead}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Start a post</h2>
            <p className="mb-3 text-sm text-gray-500">
              Free previews left: {remainingPreviews}
            </p>

            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you want to write about?"
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={4}
            />

            <button
              disabled={isPending || !topic.trim()}
              onClick={generateDraft}
              className="mt-3 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {isPending ? 'Generating...' : 'Generate preview'}
            </button>

            {message && (
              <p className="mt-3 text-sm text-red-600">{message}</p>
            )}

            {remainingPreviews === 0 && status === 'idle' && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
                You have used your free preview. Purchase credits to generate more posts.
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
            <p className="font-medium text-gray-900">How it works</p>
            <ol className="mt-2 space-y-2">
              <li>Describe the topic you want to write about.</li>
              <li>Get a preview draft before paying.</li>
              <li>Edit the draft in the editor.</li>
              <li>Pay to export the finished article.</li>
            </ol>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[320px]">
            {status === 'idle' && (
              <div className="flex h-full items-center justify-center text-gray-400">
                <p className="text-sm">Write a topic, then generate a preview draft.</p>
              </div>
            )}

            {status === 'generating' && (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                  <p className="text-sm text-gray-500">Writing your draft...</p>
                </div>
              </div>
            )}

            {status === 'ready' && draft && (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-base font-semibold shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />

                {draft.outline && (
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Outline</span>
                    <p className="mt-1">{draft.outline}</p>
                  </div>
                )}

                <textarea
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  className="w-full resize-y rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  rows={10}
                />

                <button
                  onClick={exportDraft}
                  className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
                >
                  Export finished article
                </button>
              </div>
            )}

            {status === 'exporting' && (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500">Opening checkout to export this article...</p>
              </div>
            )}

            {status === 'exported' && (
              <div className="flex h-full items-center justify-center text-brand-600">
                <p className="text-sm">Your article is ready to export after checkout.</p>
              </div>
            )}

            {status === 'failed' && (
              <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-700">
                {message || 'Something went wrong. Please try again.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
