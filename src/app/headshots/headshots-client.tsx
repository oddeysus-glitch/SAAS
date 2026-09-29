'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toaster';
import { pickCopy } from '@/lib/copy';

type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export function HeadshotsClient({ user }: { user: { id: string; previewHeadshots: number } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState<JobStatus>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const copy = pickCopy('headshots', 0);

  const remainingPreviews = typeof user.previewHeadshots === 'number' ? user.previewHeadshots : 0;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    startTransition(async () => {
      setStatus('uploading');
      setMessage(null);

      const preview = await uploadFile(file);
      setPreviewUrl(preview.url);
      setStatus('completed');
      toast.show('Preview ready. Save it or buy the full pack.', 'success');
    });
  }

  async function uploadFile(file: File): Promise<{ url: string; isPreview: boolean }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/headshots/generate', {
      method: 'POST',
      body: formData,
    });

    const json = (await res.json()) as { url?: string; error?: string; isPreview?: boolean };

    if (!res.ok) {
      throw new Error(json.error ?? 'Upload failed');
    }

    return { url: json.url ?? '', isPreview: json.isPreview ?? false };
  }

  async function buyPack() {
    startTransition(async () => {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: 'headshots' }),
      });

      const json = (await res.json()) as { url?: string; error?: string };

      if (!res.ok) {
        toast.show(json.error ?? 'Could not start checkout.', 'error');
        return;
      }

      if (json.url) {
        window.location.href = json.url;
      }
    });
  }

  return (
    <div className="max-width mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-2">{copy.headline}</h1>
        <p className="text-gray-600">{copy.subhead}</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upload your photo</h2>
          <div className="text-sm text-gray-500">
            Free previews left: {remainingPreviews}
          </div>
        </div>

        {status === 'idle' && (
          <div className="flex flex-col items-center gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="h-40 w-40 object-cover rounded-lg shadow"
              />
            ) : (
              <div className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-400">
                <div className="text-center text-gray-500">
                  <svg
                    className="mx-auto h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm">Click to upload</p>
                </div>
              </div>
            )}
            {!previewUrl && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="headshot-upload"
                />
                <label
                  htmlFor="headshot-upload"
                  className="cursor-pointer rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
                >
                  Choose photo
                </label>
              </>
            )}
          </div>
        )}

        {status === 'uploading' && (
          <div className="flex flex-col items-center gap-3">
            <div className="h-32 w-32 animate-pulse rounded-lg bg-gray-100" />
            <p className="text-sm text-gray-500">Processing preview...</p>
          </div>
        )}

        {status === 'completed' && previewUrl && (
          <div className="flex flex-col items-center gap-4">
            <img src={previewUrl} alt="preview" className="h-48 w-48 object-cover rounded-lg shadow" />
            <p className="text-sm text-gray-600 text-center">
              This is a preview. Save it or keep going with a full pack.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStatus('idle');
                  setPreviewUrl(null);
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Upload another
              </button>
              <button
                onClick={buyPack}
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Buy full pack
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-700">
            {message || 'Something went wrong. Please try again.'}
          </div>
        )}

        {!remainingPreviews && status === 'idle' && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600 mb-3">
              You have used your free preview. Purchase a pack to keep generating.
            </p>
            <button
              onClick={buyPack}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Buy headshot pack
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
        <p className="font-medium text-gray-900">How it works</p>
        <ol className="mt-2 space-y-2">
          <li>Upload one clear photo.</li>
          <li>Get a preview result before paying.</li>
          <li>Buy a pack to generate more headshots.</li>
          <li>Download and use your photos anywhere.</li>
        </ol>
      </div>
    </div>
  );
}
