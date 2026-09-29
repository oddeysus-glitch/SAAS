import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { usePreviewHeadshots } from '@/lib/credits';
import { ai, type GenerateHeadshotResult } from '@/lib/ai';
import { trackEvent } from '@/lib/analytics';
import { v4 as uuid } from 'uuid';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || typeof file !== 'object') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop() ?? 'jpg';
  const key = `${uuid()}.${ext}`;

  // In production, upload to object storage and store the URL.
  // For now, use a placeholder URL so the UI is functional end to end.
  const imageUrl = `https://picsum.photos/seed/${key}/800/800`;

  const previewOk = await usePreviewHeadshots(userId);
  if (!previewOk) {
    return NextResponse.json(
      { error: 'No preview previews remaining' },
      { status: 402 }
    );
  }

  let result: GenerateHeadshotResult;
  try {
    result = await ai.generateHeadshots({
      userId,
      imageUrl,
      style: 'professional',
    });
  } catch (error) {
    result = {
      success: false,
      output: 'failed',
      url: null,
      error: error instanceof Error ? error.message : 'Generation failed',
    };
  }

  if (!result.success || !result.url) {
    await prisma.job.create({
      data: {
        userId,
        app: 'Headshots',
        status: 'Failed',
        input: imageUrl,
        errorMessage: result.error ?? 'Unknown failure',
        creditsUsed: 0,
      },
    });

    await trackEvent(userId, 'job_failed', { app: 'headshots' });
    return NextResponse.json({ error: result.error ?? 'Generation failed' }, { status: 500 });
  }

  const job = await prisma.job.create({
    data: {
      userId,
      app: 'Headshots',
      status: 'Completed',
      input: imageUrl,
      creditsUsed: 1,
    },
  });

  await prisma.result.create({
    data: {
      jobId: job.id,
      output: result.output,
      url: result.url,
      type: 'headshot',
    },
  });

  await trackEvent(userId, 'job_completed', {
    app: 'headshots',
    creditsUsed: 1,
  });

  return NextResponse.json({
    url: result.url,
    isPreview: previewOk,
  });
}
