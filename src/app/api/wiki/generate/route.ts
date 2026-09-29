import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { sources } = body as { sources?: string };

  if (!sources) {
    return NextResponse.json({ error: 'Sources are required' }, { status: 400 });
  }

  const lines = sources
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const title = lines[0]?.slice(0, 60) || 'Wiki';

  const sections: string[] = [];
  let currentSection: string[] = [];
  let sectionTitle = 'Overview';

  for (const line of lines) {
    if (line.startsWith('#')) {
      if (currentSection.length) {
        sections.push(`<h2>${sectionTitle}</h2><ul>${currentSection.map((c) => `<li>${c.replace(/</g, '&lt;')}</li>`).join('')}</ul>`);
        currentSection = [];
      }
      sectionTitle = line.replace(/^#+\s*/, '').slice(0, 60) || 'Section';
    } else if (line.startsWith('-') || line.startsWith('*')) {
      currentSection.push(line.replace(/^[-*]\s*/, ''));
    } else if (line.includes('http')) {
      currentSection.push(`<a href="${line.replace(/"/g, '&quot;')}" target="_blank" rel="noopener noreferrer">${line}</a>`);
    } else if (line.length > 0) {
      currentSection.push(line);
    }
  }

  if (currentSection.length) {
    sections.push(`<h2>${sectionTitle}</h2><ul>${currentSection.map((c) => `<li>${c.replace(/</g, '&lt;')}</li>`).join('')}</ul>`);
  }

  const html = `
    <h1>${title}</h1>
    <p>Wiki draft generated from your sources.</p>
    ${sections.join('\n    ')}
  `.trim();

  return NextResponse.json({ html });
}
