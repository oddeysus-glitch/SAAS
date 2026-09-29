'use client';

import { useState, useTransition } from 'react';
import { useToast } from '@/components/ui/toaster';
import { triageSupportMessage, type SupportReply } from '@/lib/support';

export function SupportClient({ userId }: { userId: string }) {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState<SupportReply | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    startTransition(async () => {
      const result = triageSupportMessage(message);
      setReply(result);
      setSubmitted(true);

      try {
        await fetch('/api/support/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, message, issue: result.issue }),
        });
      } catch {
        // Support triage is best-effort.
      }

      toast.show('Reply generated. Review it below.', 'info');
    });
  }

  return (
    <div className="max-width mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-1">Support</h1>
        <p className="text-sm text-gray-500">
          Describe your issue below and get an instant reply. Complex cases are routed for review.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What is going on? For example: where are my results, my credits did not apply, I need help exporting, or I want a refund."
              className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={5}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isPending || !message.trim()}
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                {isPending ? 'Generating reply...' : 'Get reply'}
              </button>
            </div>
          </form>
        ) : reply ? (
          <div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">{reply.subject}</p>
              <p className="mt-2 text-sm text-gray-700">{reply.body}</p>
              {reply.ask.length > 0 && (
                <div className="mt-3 rounded-md border-l-2 border-brand-500 pl-3 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">Still need detail:</span>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    {reply.ask.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-3 text-xs text-gray-500">
                Next action: {reply.nextAction}
              </p>
            </div>

            <div className="mt-3 flex gap-3">
              <button
                onClick={() => {
                  setMessage('');
                  setReply(null);
                  setSubmitted(false);
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Ask another question
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
