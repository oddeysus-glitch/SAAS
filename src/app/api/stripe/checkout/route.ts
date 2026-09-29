import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStripe, type Stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { trackEvent } from '@/lib/analytics';
import { AppType } from '@prisma/client';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { app, priceId } = body as { app: 'headshots' | 'blogger'; priceId?: string };

  if (!app || (app !== 'headshots' && app !== 'blogger')) {
    return NextResponse.json({ error: 'Invalid app' }, { status: 400 });
  }

  const stripe = getStripe();
  const userId = session.user.id;
  const appType: AppType = app === 'headshots' ? AppType.Headshots : AppType.Blogger;

  const plan = priceId
    ? await prisma.plan.findFirst({
        where: { priceId, app: appType },
      })
    : await prisma.plan.findFirst({
        where: { app: appType },
        orderBy: { amount: 'asc' },
      });

  if (!plan) {
    return NextResponse.json({ error: 'No plan configured' }, { status: 400 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      app: app === 'headshots' ? 'headshots' : 'blogger',
      priceId: plan.priceId,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&app=${app}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?app=${app}`,
  });

  await trackEvent(userId, 'checkout_start', { app: appType });

  return NextResponse.json({ url: checkoutSession.url });
}
