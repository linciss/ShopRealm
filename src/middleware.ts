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
import { i18nRouter } from 'next-i18n-router';
import i18nConfig from '../i18n-config';

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

  const pathname = req.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');

  const localeMatch = pathname.match(/^\/([a-z]{2})(?=\/|$)/);
  const locale = localeMatch ? localeMatch[1] : null;

  const validLocales = i18nConfig.locales || ['en'];

  // locale fallback
  if (locale && !validLocales.includes(locale)) {
    const defaultLocale = i18nConfig.defaultLocale || 'en';
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathnameWithoutLocale}`, req.url),
    );
  }

  const isApiAuthRoute = pathnameWithoutLocale.startsWith(apiAuthPrefix);
  const isPublicRoute =
    publicRoutes.includes(pathnameWithoutLocale) ||
    matchesRoute(pathnameWithoutLocale, publicRoutes);
  const isAuthRoute = authRoutes.includes(pathnameWithoutLocale);
  const isStoreRoute = storeRoutes.includes(pathnameWithoutLocale);
  const isShopperRoute = shopperRoutes.includes(pathnameWithoutLocale);
  const isFallbackRoute = FALLBACK_REDIRECT === pathnameWithoutLocale;

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return (
        NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl)) &&
        i18nRouter(req, i18nConfig)
      );
    }
    return NextResponse.next() && i18nRouter(req, i18nConfig);
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

  return NextResponse.next() && i18nRouter(req, i18nConfig);
});

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|$|.*\\.(?:ico|png|jpg|jpeg|svg|js|css|woff2|ttf)).*)',
  ],
};
