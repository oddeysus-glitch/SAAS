import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { idea, format } = body as { idea?: string; format?: 'social' | 'blog' | 'video' };

  if (!idea) {
    return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
  }

  const pack =
    format === 'blog'
      ? {
          title: `How To Make ${idea} Work`,
          outline: `Problem, approach, examples, next steps`,
          post: `A practical guide to ${idea}. Start with the outcome, explain the approach, and finish with clear next steps.`,
        }
      : format === 'video'
      ? {
          title: `Video idea: ${idea}`,
          hook: `Here's the part most people miss about ${idea}.`,
          script: `Intro: hook the viewer with the biggest mistake or opportunity related to ${idea}.\n\nBody: explain the idea in simple steps.\n\nClose: give one action they can take today.`,
          caption: `A quick breakdown of ${idea}. Save this for later.`,
        }
      : {
          title: `Social pack for ${idea}`,
          post1: `One sharp take on ${idea}.`,
          post2: `A practical tip that makes ${idea} easier.`,
          caption: `Thoughts on ${idea}. What would you add?`,
          hashtags: '#content #creator #ideas',
        };

  return NextResponse.json({ pack });
}
