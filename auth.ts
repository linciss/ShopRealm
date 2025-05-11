import NextAuth, { DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from './auth.config';
import prisma from '@/lib/db';
import { getUserById } from './data/user';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string;
      hasStore?: boolean;
      admin?: boolean;
      adminLevel?: string;
    } & DefaultSession['user'];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/sign-in',
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
      if (token.sub && session.user) {
        try {
          session.user.id = token.sub;
          session.user.role = token.role as string;
          session.user.hasStore = token.hasStore as boolean;
          if (token.admin) {
            session.user.adminLevel = token.adminLevel as string;
            session.user.admin = token.admin as boolean;
          }
        } catch (error) {
          console.error('Error verifying user session:', error);
        }
      }
      return session;
    },
    async jwt({ token }) {
      if (!token?.sub) return token;
      const user = await getUserById(token.sub);

      if (!user) {
        token.sub = undefined;
        return token;
      }

      token.hasStore = user.hasStore;
      token.role = user.role;
      if (user.adminPrivileges) {
        token.admin = user.adminPrivileges === true;
        token.adminLevel = user.adminLevel;
      }

      token.updatedAt = Date.now();

      return token;
    },
  },
});
