import { NextRequest, NextResponse } from 'next/server';
import { readBody } from '@/lib/http';
import { handleWebhook } from '@/lib/webhooks';

export async function POST(request: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await readBody(request);
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const result = await handleWebhook(rawBody);
  return NextResponse.json(result);
}

export async function GET() {
  return NextResponse.json({ received: true });
}
