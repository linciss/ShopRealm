import authConfig from '../auth.config';
import NextAuth from 'next-auth';
import {
  apiAuthPrefix,
  authRoutes,
  FALLBACK_REDIRECT,
  publicRoutes,
  shopperRoutes,
  storeRoutes,
} from '../routes';
import { NextResponse } from 'next/server';
import { DEFAULT_SIGNIN_REDIRECT } from './../routes';
import { getToken } from 'next-auth/jwt';
import { signOut } from '../auth';

const { auth } = NextAuth(authConfig);

const secret = process.env.AUTH_SECRET;

// matcher for dynamic routes
const matchesRoute = (pathname: string, routes: string[]): boolean => {
  return routes.some((route) => {
    const pattern = route.replace(/\[([^\]]+)\]/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  });
};

export default auth(async (req) => {
  const { nextUrl } = req;

  const token = await getToken({
    req,
    secret,
    secureCookie: process.env.NODE_ENV === 'production',
  });

  const session = {
    name: token?.name,
    email: token?.email,
    id: token?.sub,
    hasStore: token?.hasStore,
    role: token?.role,
  };

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = matchesRoute(nextUrl.pathname, publicRoutes);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isStoreRoute = storeRoutes.includes(nextUrl.pathname);
  const isShopperRoute = shopperRoutes.includes(nextUrl.pathname);
  const isFallbackRoute = FALLBACK_REDIRECT.includes(nextUrl.pathname);

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

  // cehcks if user has been redirected to fallback site which means that user has no session and deletes their cookies
  if (isFallbackRoute) {
    await signOut({
      redirect: false,
    });
    return NextResponse.redirect(new URL('/auth/sign-in', nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
    '/products/:path*',
    '/products/:path',
  ],
};
