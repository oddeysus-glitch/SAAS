import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { usePreviewBlogs } from '@/lib/credits';
import { ai, type GenerateBlogResult } from '@/lib/ai';
import { trackEvent } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json();
  const { topic } = body as { topic?: string };

  if (!topic) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
  }

  const previewOk = await usePreviewBlogs(userId);
  if (!previewOk) {
    return NextResponse.json(
      { error: 'No preview previews remaining' },
      { status: 402 }
    );
  }

  let result: GenerateBlogResult;
  try {
    result = await ai.generateBlogPost({
      userId,
      topic,
      tone: 'professional',
      length: 'medium',
    });
  } catch (error) {
    result = {
      success: false,
      title: 'Untitled',
      body: '',
      outline: null,
      error: error instanceof Error ? error.message : 'Generation failed',
    };
  }

  if (!result.success) {
    await prisma.job.create({
      data: {
        userId,
        app: 'Blogger',
        status: 'Failed',
        input: topic,
        errorMessage: result.error ?? 'Unknown failure',
        creditsUsed: 0,
      },
    });

    await trackEvent(userId, 'job_failed', { app: 'blogger' });
    return NextResponse.json({ error: result.error ?? 'Generation failed' }, { status: 500 });
  }

  const job = await prisma.job.create({
    data: {
      userId,
      app: 'Blogger',
      status: 'Completed',
      input: topic,
      creditsUsed: 1,
    },
  });

  await prisma.result.create({
    data: {
      jobId: job.id,
      output: JSON.stringify({ title: result.title, outline: result.outline, body: result.body }),
      url: null,
      type: 'blog',
    },
  });

  await trackEvent(userId, 'job_completed', {
    app: 'blogger',
    creditsUsed: 1,
  });

  return NextResponse.json({
    title: result.title,
    outline: result.outline ?? null,
    body: result.body,
    isPreview: previewOk,
  });
}
