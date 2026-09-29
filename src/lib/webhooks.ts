import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { getStripe, getWebhookSecret } from '@/lib/stripe';
import { grantCredits } from '@/lib/credits';
import { AppType, CreditType } from '@prisma/client';

export type WebhookEvent = {
  type: string;
  data: {
    object: {
      id: string;
      metadata?: Record<string, string>;
      amount_total?: number | null;
      quantity?: number | null;
    };
  };
};

export async function handleWebhook(rawBody: string) {
  const stripe = getStripe();
  const secret = getWebhookSecret();

  const signature = headers().get('stripe-signature');
  if (!signature) {
    return { received: true };
  }

  let event: import('stripe').Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return { received: true };
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as typeof event.data.object & {
      metadata?: Record<string, string>;
      amount_total?: number | null;
      quantity?: number | null;
    };

    const userId = session.metadata?.userId;
    const appRaw = session.metadata?.app;
    const priceId = session.metadata?.priceId;

    if (!userId || !appRaw || !priceId) {
      return { received: true };
    }

    const app = appRaw === 'headshots' ? AppType.Headshots : AppType.Blogger;
    const credits = app === AppType.Headshots ? CreditType.Headshots : CreditType.BlogPosts;
    const amount = session.amount_total ?? 0;

    await grantCredits(
      userId,
      credits,
      1,
      `checkout_completed:${priceId}`,
      session.id,
      session.id
    );

    await prisma.event.create({
      data: {
        userId,
        name: 'checkout_completed',
        properties: JSON.stringify({
          app,
          priceId,
          amount,
        }),
      },
    });
  }

  return { received: true };
}
