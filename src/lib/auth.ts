import { PrismaAdapter } from '@auth/prisma-adapter'; 
import { compare, hash } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import { trackEvent } from '@/lib/analytics';
import type { User } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      previewHeadshots: number;
      previewBlogs: number;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    previewHeadshots: number;
    previewBlogs: number;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Email password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existing = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!existing) {
          return null;
        }

        const isValid = await compare(credentials.password as string, existing.passwordHash ?? '');
        if (!isValid) {
          return null;
        }

        return {
          id: existing.id,
          email: existing.email,
          name: existing.name ?? undefined,
          image: existing.image ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            ...(user.name && { name: user.name }),
            ...(user.image && { image: user.image }),
          },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            previewCounts: { where: { userId: user.id } },
          },
        });

        token.id = user.id as string;
        token.previewHeadshots = dbUser?.previewCounts[0]?.headshots ?? 0;
        token.previewBlogs = dbUser?.previewCounts[0]?.blogs ?? 0;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.previewHeadshots = token.previewHeadshots;
      session.user.previewBlogs = token.previewBlogs;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await prisma.previewCount.create({
        data: {
          userId: user.id,
          headshots: 1,
          blogs: 1,
        },
      });
      await trackEvent(user.id, 'signup', { method: 'create' });
    },
  },
};
