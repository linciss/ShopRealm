import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from './auth.config';
import prisma from '@/lib/db';

// EXTRA TYPES FOR USER INTERFACE SO I CAN STORE USER PROPS IN JWT FOR EDGE RUNTIME!!!
declare module 'next-auth' {
  interface User {
    role?: string | null;
    hasStore?: boolean | null;
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    role?: string | null;
    hasStore?: boolean | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
