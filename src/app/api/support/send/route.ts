import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { triageSupportMessage } from '@/lib/support';
import { trackEvent } from '@/lib/analytics';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { message, subject } = body as { message?: string; subject?: string };

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const reply = triageSupportMessage(message);
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

  await trackEvent(session.user.id, 'support_triage', {
    issue: reply.issue,
    hasReply: true,
  });

// In production, send this through your email provider or support inbox.
// For now, the triage reply is prepared and logged so you can wire the real
// delivery without changing the app.
const payload = {
  from: session.user.email,
  subject: subject ?? reply.subject,
  reply,
  message,
  supportEmail,
};

// Save a copy so support has a record.
await prisma.event.create({
  data: {
    userId: session.user.id,
    name: 'support_message_sent',
    properties: JSON.stringify(payload),
  },
});

console.log(JSON.stringify(payload, null, 2));

  return NextResponse.json({
    received: true,
    autoReply: reply.body,
    nextAction: reply.nextAction,
  });
}
