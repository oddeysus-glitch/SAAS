export type HeadlineVariant = {
  headline: string;
  subhead: string;
  proofHook: string;
  cta: string;
  audienceWedge: string;
};

export const headshotsCopy: HeadlineVariant[] = [
  {
    headline: 'Professional headshots from your selfies.',
    subhead: 'Upload a few photos. Get a pack of polished headshots you can use anywhere.',
    proofHook: 'See one before you you buy. Then grab the full pack.',
    cta: 'Get my headshots',
    audienceWedge: 'Professionals optimizing their LinkedIn / profile image',
  },
  {
    headline: 'Turn a few casual photos into a polished headshot pack.',
    subhead: 'No studio. No waiting. Just better profile photos when you need them.',
    proofHook: 'Preview a result first, then pay for the pack.',
    cta: 'Start my preview',
    audienceWedge: 'Job seekers and remote professionals',
  },
];

export const bloggerCopy: HeadlineVariant[] = [
  {
    headline: 'Blog posts you can publish, not just drafts.',
    subhead: 'Write, refine, and export SEO-ready articles in one place.',
    proofHook: 'Generate a preview, then pay to finish and export.',
    cta: 'Write my first post',
    audienceWedge: 'Solo creators and small business owners',
  },
  {
    headline: 'Stop staring at a blank page. Start shipping content.',
    subhead: 'Get a usable article draft fast, then shape it the way you want.',
    proofHook: 'Preview before you pay. Export when it is ready.',
    cta: 'Try a preview',
    audienceWedge: 'Marketers who need consistent blog output',
  },
];

export function pickCopy(
  app: 'headshots' | 'blogger',
  variantIndex = 0
): HeadlineVariant {
  const pool = app === 'headshots' ? headshotsCopy : bloggerCopy;
  return pool[variantIndex % pool.length];
}
