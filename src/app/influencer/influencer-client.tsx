'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toaster';

type Persona = {
  name: string;
  niche: string;
  tone: string;
  platform: string;
};

export function InfluencerClient({ user }: { user: { id: string; email: string } }) {
  const router = useRouter();
  const toast = useToast();
  const [persona, setPersona] = useState<Persona>({
    name: '',
    niche: '',
    tone: 'confident',
    platform: 'instagram',
  });
  const [plan, setPlan] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'exporting'>('idle');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const nicheOptions = [
    'fitness',
    'beauty',
    'tech',
    'travel',
    'finance',
    'lifestyle',
    'fashion',
    'food',
  ];

  function updateField(field: keyof Persona, value: string) {
    setPersona((prev) => ({ ...prev, [field]: value }));
  }

  async function generatePlan() {
    if (!persona.name.trim() || !persona.niche.trim()) {
      setMessage('Name and niche are required.');
      return;
    }

    startTransition(async () => {
      setStatus('generating');
      setMessage(null);

      const res = await fetch('/api/influencer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona),
      });

      const json = (await res.json()) as { ideas?: string[]; bio?: string; error?: string };

      if (!res.ok) {
        setStatus('idle');
        setMessage(json.error ?? 'Generation failed.');
        return;
      }

      setPlan(json.ideas ?? []);
      setStatus('ready');
      toast.show('Influencer plan ready. Review it, then pay to export the content pack.', 'success');
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
          app: 'influencer',
          method: 'venmo',
          amount: 49,
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
        <h1 className="mb-2">AI Influencer Studio</h1>
        <p className="text-gray-600">
          Build a consistent influencer persona and generate a content plan around it.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Persona</h2>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={persona.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Influencer name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Niche</label>
                <select
                  value={persona.niche}
                  onChange={(e) => updateField('niche', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">Select a niche</option>
                  {nicheOptions.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tone</label>
                <select
                  value={persona.tone}
                  onChange={(e) => updateField('tone', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="confident">Confident</option>
                  <option value="casual">Casual</option>
                  <option value="luxury">Luxury</option>
                  <option value="funny">Funny</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Main platform</label>
                <select
                  value={persona.platform}
                  onChange={(e) => updateField('platform', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <button
                disabled={isPending || status === 'generating'}
                onClick={generatePlan}
                className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                {status === 'generating' ? 'Generating...' : 'Generate content plan'}
              </button>

              {message && <p className="text-sm text-red-600">{message}</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[320px]">
            {status === 'idle' && (
              <div className="flex h-full items-center justify-center text-gray-400">
                <p className="text-sm">Your influencer plan will appear here.</p>
              </div>
            )}

            {status === 'generating' && (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                  <p className="text-sm text-gray-500">Building persona and content plan...</p>
                </div>
              </div>
            )}

            {status === 'ready' && plan.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm">
                  <p className="font-medium text-gray-900">Persona snapshot</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Name: {persona.name}</li>
                    <li>Niche: {persona.niche}</li>
                    <li>Tone: {persona.tone}</li>
                    <li>Platform: {persona.platform}</li>
                  </ul>
                </div>

                <div className="rounded-md border border-gray-200 p-4 text-sm">
                  <p className="font-medium text-gray-900">Content ideas</p>
                  <ul className="mt-2 space-y-2 list-disc list-inside">
                    {plan.map((idea, i) => (
                      <li key={i}>{idea}</li>
                    ))}
                  </ul>
                </div>

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
