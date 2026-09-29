import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { message, issue } = body as { message?: string; issue?: string };

  await prisma.event.create({
    data: {
      userId: session.user.id,
      name: 'support_triage',
      properties: JSON.stringify({ message: message ?? '', issue: issue ?? 'unknown' }),
    },
  });

  return NextResponse.json({ received: true });
}
