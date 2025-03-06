import NextAuth, { DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from './auth.config';
import prisma from '@/lib/db';
import { getUserById } from './data/user';

declare module 'next-auth' {
  interface Session {
    user: { role: string } & DefaultSession['user'];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  adapter: PrismaAdapter({ prisma: prisma }),
  session: { strategy: 'jwt' },
  ...authConfig,
  callbacks: {
    // checks whether the user even exists in the db after login with credentials
    async signIn({ user }) {
      const existingUser = await getUserById(user.id ?? '');
      if (!existingUser) return false;
      return true;
    },
    async session({ token, session }) {
      if (token.sub) {
        try {
          const user = await getUserById(token.sub);

          if (!user) {
            return null;
          }

          session.user.id = token.sub;
          session.user.role = token.role as string;
        } catch (error) {
          console.error('Error verifying user session:', error);
          return null;
        }
      }
      return session;
    },
    async jwt({ token }) {
      if (!token?.sub) return token;
      const user = await getUserById(token.sub);

      if (!user) {
        return token;
      }

      token.role = user.role;

      return token;
    },
  },
});
