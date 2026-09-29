import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, niche, tone, platform } = body as {
    name?: string;
    niche?: string;
    tone?: string;
    platform?: string;
  };

  if (!name || !niche) {
    return NextResponse.json({ error: 'Name and niche are required' }, { status: 400 });
  }

  const ideas = [
    `A day in the life of a ${niche} creator using the ${tone} voice.`,
    `Top mistakes people make in ${niche} and how to fix them.`,
    `A behind-the-scenes breakdown of how ${name} creates content.`,
    `One ${niche} trend explained in simple terms.`,
    `A compare-and-contrast post: what works and what does not in ${niche}.`,
    `A quick starter guide for someone new to ${niche}.`,
    `A personal story that fits the ${tone} tone and ${platform} format.`,
    `A myth-busting post about common ${niche} advice.`,
  ];

  const bio = `${name} is a ${niche} creator with a ${tone} voice. Content focuses on practical ideas, clear takes, and a consistent style for ${platform}.`;

  return NextResponse.json({ ideas, bio });
}
