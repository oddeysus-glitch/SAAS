export type CompetitorSnapshot = {
  takenAt: string;
  headshots: {
    observedPriceRanges: string[];
    observedOfferShapes: string[];
    observedAngles: string[];
  };
  blogger: {
    observedPriceRanges: string[];
    observedOfferShapes: string[];
    observedAngles: string[];
  };
};

export function buildResearchSnapshot(): CompetitorSnapshot {
  return {
    takenAt: new Date().toISOString(),
    headshots: {
      observedPriceRanges: ['$20-$50 per pack', 'team/multi-pack variants reported'],
      observedOfferShapes: ['one-time pack', 'multi-pack bundle', 'limited preview use'],
      observedAngles: [
        'professional profile photos',
        'LinkedIn / personal branding',
        'team headshots',
        'before/after proof',
      ],
    },
    blogger: {
      observedPriceRanges: ['credit-based', 'per-article', 'low-to-mid hundreds/mo for heavier use'],
      observedOfferShapes: ['credit pack', 'per-article', 'subscription for power users'],
      observedAngles: [
        'publishable drafts',
        'SEO support',
        'exportable content',
        'time saved',
      ],
    },
  };
}

export type ResearchInsight = {
  category: 'headshots' | 'blogger';
  recommendation: string;
  why: string;
};

export function recommendFirstOffer(snapshot: CompetitorSnapshot): ResearchInsight[] {
  return [
    {
      category: 'headshots',
      recommendation:
        'Launch with one one-time pack first. Keep the offer simple and price-anchored against a clear pack count.',
      why: 'Visual products convert fastest when the buyer sees a single clear outcome and a clear price, not a complex tier ladder.',
    },
    {
      category: 'blogger',
      recommendation:
        'Launch with credits or a per-article path first, then add a subscription only after repeat usage is proven.',
      why: 'New buyers convert better with low commitment, and you avoid over-selling a suite before you know the repeat pattern.',
    },
  ];
}
