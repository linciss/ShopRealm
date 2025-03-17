import authConfig from '../auth.config';
import NextAuth from 'next-auth';
import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  shopperRoutes,
  storeRoutes,
} from '../routes';
import { NextResponse } from 'next/server';
import { DEFAULT_SIGNIN_REDIRECT } from './../routes';
import { getToken } from 'next-auth/jwt';

const { auth } = NextAuth(authConfig);

const secret = process.env.AUTH_SECRET;

export default auth(async (req) => {
  const { nextUrl } = req;

  const token = await getToken({
    req,
    secret,
    salt:
      process.env.NODE_ENV === 'development'
        ? 'authjs.session-token'
        : '__Secure-authjs.session-token',
  });

  const session = {
    name: token?.name,
    email: token?.email,
    id: token?.sub,
    hasStore: token?.hasStore,
    role: token?.role,
  };

  console.log(session);

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isStoreRoute = storeRoutes.includes(nextUrl.pathname);
  const isShopperRoute = shopperRoutes.includes(nextUrl.pathname);

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

  // cehcks whether the user is a shopper and is trying to access the store route
  if (isStoreRoute && session?.role === 'SHOPPER') {
    return NextResponse.redirect(new URL('/products', nextUrl));
  }

  // checks whether the user is a store and is trying to access the public routes
  if (isShopperRoute && session?.role === 'STORE') {
    return NextResponse.redirect(new URL('/store', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
