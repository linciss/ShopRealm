export const shopperRoutes = [
  '/cart',
  '/products',
  '/sale',
  '/new',
  '/store/[id]',
  '/products/[id]',
  '/about',
  '/featured',
];

export const publicRoutes = ['/', '/about-us', ...shopperRoutes];

export const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export const storeRoutes = ['/store', '/store/product'];

export const privateRoutes = [
  '/create-store',
  'checkout',
  '/profile',
  ...storeRoutes,
];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_SIGNOUT_REDIRECT = '/products';

export const DEFAULT_SIGNIN_REDIRECT = '/products';

export const DEFAULT_SIGNUP_REDIRECT = '/products';

export const FALLBACK_REDIRECT = '/invalid-session';
