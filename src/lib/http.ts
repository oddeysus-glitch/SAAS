import { NextRequest } from 'next/server';

export async function readBody(request: NextRequest): Promise<string> {
  const chunks: BlobPart[] = [];

  const reader = request.body?.getReader();
  if (!reader) {
    throw new Error('Empty body');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value as BlobPart);
  }

  const blob = new Blob(chunks);
  return blob.text();
}
