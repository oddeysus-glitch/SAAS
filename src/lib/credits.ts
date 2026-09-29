import { prisma } from '@/lib/db';
import { trackEvent } from '@/lib/analytics';
import type { CreditType } from '@prisma/client';

export async function getUserCreditBalance(userId: string, type: CreditType) {
  const ledger = await prisma.creditLedger.findMany({
    where: { userId, type },
    orderBy: { createdAt: 'desc' },
    take: 1,
  });
  return ledger[0]?.balance ?? 0;
}

export async function usePreviewHeadshots(userId: string) {
  const preview = await prisma.previewCount.update({
    where: { userId },
    data: {
      headshots: { decrement: 1 },
    },
  });

  if (preview.headshots < 0) {
    await prisma.previewCount.update({
      where: { userId },
      data: { headshots: 0 },
    });
    return false;
  }

  await trackEvent(userId, 'preview_headshot', { remaining: preview.headshots });
  return true;
}

export async function usePreviewBlogs(userId: string) {
  const preview = await prisma.previewCount.update({
    where: { userId },
    data: {
      blogs: { decrement: 1 },
    },
  });

  if (preview.blogs < 0) {
    await prisma.previewCount.update({
      where: { userId },
      data: { blogs: 0 },
    });
    return false;
  }

  await trackEvent(userId, 'preview_blog', { remaining: preview.blogs });
  return true;
}

export async function grantCredits(
  userId: string,
  type: CreditType,
  amount: number,
  reason: string,
  stripeSessionId?: string,
  stripePaymentIntentId?: string
) {
  const last = await prisma.creditLedger.findMany({
    where: { userId, type },
    orderBy: { createdAt: 'desc' },
    take: 1,
  });

  const previousBalance = last[0]?.balance ?? 0;
  const newBalance = previousBalance + amount;

  await prisma.creditLedger.create({
    data: {
      userId,
      type,
      amount,
      balance: newBalance,
      reason,
      stripeSessionId,
      stripePaymentIntentId,
    },
  });

  await trackEvent(userId, 'credit_granted', {
    type,
    amount,
    newBalance,
  });

  return newBalance;
}
