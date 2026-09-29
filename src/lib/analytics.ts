import { prisma } from '@/lib/db';

export type AnalyticsEvent =
  | 'signup'
  | 'preview_headshot'
  | 'preview_blog'
  | 'checkout_start'
  | 'checkout_completed'
  | 'credit_granted'
  | 'job_started'
  | 'job_completed'
  | 'job_failed'
  | 'result_downloaded'
  | 'article_exported'
  | 'support_triage'
  | 'billing_request';

type EventPropertyValue = string | number | boolean | null | undefined;

function safeValue(value: EventPropertyValue): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

export async function trackEvent(
  userId: string,
  name: AnalyticsEvent,
  properties?: Record<string, EventPropertyValue>
) {
  try {
    await prisma.event.create({
      data: {
        userId,
        name,
        properties: properties ? JSON.stringify(properties) : null,
      },
    });
  } catch {
    // Event tracking must never break the product.
  }
}

export type ConversionSummary = Awaited<ReturnType<typeof getConversionSummaryInner>>;

async function getConversionSummaryInner(days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const signups = await prisma.event.count({
    where: {
      createdAt: { gte: since },
      name: 'signup',
    },
  });

  const checkoutCompleted = await prisma.event.count({
    where: {
      createdAt: { gte: since },
      name: 'checkout_completed',
    },
  });

  const checkoutStart = await prisma.event.count({
    where: {
      createdAt: { gte: since },
      name: 'checkout_start',
    },
  });

  const headshotPreviews = await prisma.event.count({
    where: {
      createdAt: { gte: since },
      name: 'preview_headshot',
    },
  });

  const blogPreviews = await prisma.event.count({
    where: {
      createdAt: { gte: since },
      name: 'preview_blog',
    },
  });

  return {
    signups,
    checkoutCompleted,
    checkoutStart,
    checkoutConversionRate: checkoutStart > 0 ? checkoutCompleted / checkoutStart : 0,
    headshotPreviews,
    blogPreviews,
  };
}

export { getConversionSummaryInner as getConversionSummary };
