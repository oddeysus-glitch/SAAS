import { getServerSideEnv } from '@/lib/env';

export type HeadshotRequest = {
  userId: string;
  imageUrl: string;
  style?: string;
};

export type BlogRequest = {
  userId: string;
  topic: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
};

export interface AIProvider {
  generateHeadshots(request: HeadshotRequest): Promise<GenerateHeadshotResult>;
  generateBlogPost(request: BlogRequest): Promise<GenerateBlogResult>;
}

export interface GenerateHeadshotResult {
  success: boolean;
  output: string;
  url?: string | null;
  error?: string | null;
}

export interface GenerateBlogResult {
  success: boolean;
  title: string;
  body: string;
  outline?: string | null;
  error?: string | null;
}

function mockHeadshotResult(): GenerateHeadshotResult {
  return {
    success: true,
    output: 'headshot',
    url: 'https://picsum.photos/seed/mock/800/800',
  };
}

function mockBlogResult(): GenerateBlogResult {
  return {
    success: true,
    title: 'How To Ship Faster Without Burning Out',
    outline: 'Problem, approach, tradeoffs, next steps',
    body: 'Content production is one of those tasks that feels small until it blocks everything else. The fastest teams do not write more. They write the right thing first and reduce the number of rounds it takes to get something usable.\n\nStart with the outcome, not the outline. Every piece of content should answer one question a real buyer or reader actually has. If you cannot name that question in one sentence, the draft is already drifting.\n\nKeep the first draft narrow. A tight draft is easier to edit than a wandering one. It is also easier to turn into a usable article, email, or landing page later. That is where the time savings come from.\n\nThe second lever is reuse. If a section works, use it again. If a structure works, keep it. The point is not to be clever every time. The point is to remove friction from the next piece.\n\nFinally, measure the thing that matters: time from idea to publishable draft. If that number improves, the process is working. If it does not, the bottleneck is usually the first draft, not the polish.',
  };
}

export function createAIProvider(): AIProvider {
  const provider = getServerSideEnv('AI_PROVIDER');

  if (provider === 'mock') {
    return {
      generateHeadshots: async () => mockHeadshotResult(),
      generateBlogPost: async () => mockBlogResult(),
    };
  }

  // Real provider implementation goes here.
  // Swap the provider without touching app code.
  return {
    generateHeadshots: async () => mockHeadshotResult(),
    generateBlogPost: async () => mockBlogResult(),
  };
}

export const ai = createAIProvider();

export function canUseMockProvider(): boolean {
  return getServerSideEnv('AI_PROVIDER') === 'mock';
}
