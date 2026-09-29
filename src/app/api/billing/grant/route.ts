import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { grantCredits } from '@/lib/credits';
import { trackEvent } from '@/lib/analytics';
import type { CreditType } from '@prisma/client';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    userId,
    app,
    amount,
    note,
    recordPayoutRequest,
  } = body as {
    userId?: string;
    app?: 'headshots' | 'blogger';
    amount?: number;
    note?: string;
    recordPayoutRequest?: boolean;
  };

  if (!userId || !app) {
    return NextResponse.json(
      { error: 'userId and app are required' },
      { status: 400 },
    );
  }

  const credits: CreditType = app === 'blogger' ? 'BlogPosts' : 'Headshots';

  let payoutId: string | undefined;

  if (recordPayoutRequest !== false) {
    const payout = await prisma.payoutRequest.create({
      data: {
        userId,
        app,
        amount: amount ?? 1,
        status: 'pending',
        note: note ?? `manual_grant:${app}`,
      },
    });

    payoutId = payout.id;
  }

  const balance = await grantCredits(
    userId,
    credits,
    amount ?? 1,
    `manual_grant:${app}:${note ?? 'owner'}${payoutId ? ` | payout:${payoutId}` : ''}`,
    undefined,
    undefined,
  );

  await trackEvent(userId, 'credit_granted', {
    type: credits,
    amount: amount ?? 1,
    newBalance: balance,
    source: 'manual_owner_grant',
    payoutRequestId: payoutId,
  });

  return NextResponse.json({
    ok: true,
    newBalance: balance,
    payoutRequestId: payoutId,
  });
}
