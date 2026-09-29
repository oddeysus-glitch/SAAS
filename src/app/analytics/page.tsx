import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getConversionSummary } from '@/lib/analytics';
import { buildResearchSnapshot, recommendFirstOffer } from '@/lib/research';
import { AnalyticsClient } from './analytics-client';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/analytics');
  }

  const summary = await getConversionSummary(7);
  const snapshot = buildResearchSnapshot();
  const recommendations = recommendFirstOffer(snapshot);

  return <AnalyticsClient summary={summary} snapshot={snapshot} recommendations={recommendations} />;
}
