import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { trackEvent } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    userId,
    email,
    app,
    method,
    amount,
  } = body as {
    userId?: string;
    email?: string;
    app?: 'headshots' | 'blogger';
    method?: 'paypal' | 'venmo';
    amount?: number;
  };

  if (!userId || !app) {
    return NextResponse.json(
      { error: 'userId and app are required' },
      { status: 400 },
    );
  }

  const properties = JSON.stringify({
    app: app ?? 'headshots',
    method: method ?? 'paypal',
    amount: amount ?? 0,
    email: email ?? '',
  });

  const record = await prisma.billingRequest.create({
    data: {
      userId,
      properties,
    },
  });

  await trackEvent(userId, 'billing_request', {
    app: app ?? 'headshots',
    method: method ?? 'paypal',
    amount: amount ?? 0,
  });

  return NextResponse.json({ ok: true, id: record.id });
}
