'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { trackEvent } from '@/lib/analytics';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const passwordHash = await hash(password, 12);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: passwordHash,
          previewCounts: {
            create: {
              headshots: 1,
              blogs: 1,
            },
          },
        },
      });

      await trackEvent(user.id, 'signup', { method: 'email' });
      router.push('/auth/signin');
    } catch {
      setMessage('That email is already in use.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-width mx-auto mt-24 max-w-md px-4 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2">Create an account</h1>
        <p className="mb-6 text-sm text-gray-500">
          Start with a free preview. Pay when you want real results.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
              minLength={8}
            />
          </div>
          {message && (
            <p className="text-sm text-red-600">{message}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-brand-600 no-underline hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
