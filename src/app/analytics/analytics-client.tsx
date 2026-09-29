'use client';

import { buildResearchSnapshot, type CompetitorSnapshot, type ResearchInsight } from '@/lib/research';
import type { ConversionSummary } from '@/lib/analytics';
import { getConversionSummary } from '@/lib/analytics';

export function AnalyticsClient({
  summary,
  snapshot,
  recommendations,
}: {
  summary: ConversionSummary;
  snapshot: CompetitorSnapshot;
  recommendations: ResearchInsight[];
}) {
  return (
    <div className="max-width mx-auto mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="mb-1">Analytics</h1>
        <p className="text-sm text-gray-500">Last 7 days, unless noted otherwise.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Signups</p>
          <p className="mt-1 text-2xl font-semibold">{summary.signups}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Checkout started</p>
          <p className="mt-1 text-2xl font-semibold">{summary.checkoutStart}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Checkout completed</p>
          <p className="mt-1 text-2xl font-semibold">{summary.checkoutCompleted}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Checkout conversion</p>
          <p className="mt-1 text-2xl font-semibold">
            {(summary.checkoutConversionRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Headshot previews</h2>
          <p className="text-2xl font-semibold">{summary.headshotPreviews}</p>
          <p className="text-sm text-gray-500">Free previews used in the last 7 days.</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Blog previews</h2>
          <p className="text-2xl font-semibold">{summary.blogPreviews}</p>
          <p className="text-sm text-gray-500">Free previews used in the last 7 days.</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Market snapshot</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-gray-900">Headshots</p>
            <ul className="mt-1 space-y-1 text-gray-600">
              <li>Price shapes seen: {snapshot.headshots.observedPriceRanges.join('; ')}</li>
              <li>Offer shapes seen: {snapshot.headshots.observedOfferShapes.join('; ')}</li>
              <li>Angles seen: {snapshot.headshots.observedAngles.join('; ')}</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900">Blogger</p>
            <ul className="mt-1 space-y-1 text-gray-600">
              <li>Price shapes seen: {snapshot.blogger.observedPriceRanges.join('; ')}</li>
              <li>Offer shapes seen: {snapshot.blogger.observedOfferShapes.join('; ')}</li>
              <li>Angles seen: {snapshot.blogger.observedAngles.join('; ')}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Automated research recommendations</h2>
        <ul className="space-y-3 text-sm">
          {recommendations.map((r) => (
            <li key={r.category} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{r.category === 'headshots' ? 'Headshots' : 'Blogger'}</p>
              <p className="mt-1 text-gray-700">{r.recommendation}</p>
              <p className="mt-1 text-gray-500">{r.why}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Automated support triage</h2>
        <p className="text-sm text-gray-600">
          Support replies are generated from a documented issue map. Common issues are resolved automatically; refunds and account problems are flagged for review.
        </p>
      </div>
    </div>
  );
}
