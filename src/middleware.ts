import authConfig from '../auth.config';
import NextAuth from 'next-auth';
import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  storeRoutes,
} from '../routes';
import { NextResponse } from 'next/server';
import { DEFAULT_SIGNIN_REDIRECT } from './../routes';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const session = await auth();

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isStoreRoute = storeRoutes.includes(nextUrl.pathname);

  console.log(session, 'cock');

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/sign-in', nextUrl));
  }

  if (isStoreRoute && !session?.user?.hasStore) {
    return NextResponse.redirect(new URL('/store/create', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
