export const shopperRoutes = [
  '/cart',
  '/checkout',
  '/products',
  '/sale',
  '/new',
  '/categories',
  '/category/electronics',
  '/store/[id]',
  '/products/[id]',
  '/category/',
];

export const publicRoutes = ['/', '/about-us', ...shopperRoutes];

export const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
];

export const storeRoutes = ['/store', '/store/product', '/create-store'];

export const privateRoutes = ['/profile', ...storeRoutes];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_SIGNOUT_REDIRECT = '/products';

export const DEFAULT_SIGNIN_REDIRECT = '/products';

export const DEFAULT_SIGNUP_REDIRECT = '/products';

export const FALLBACK_REDIRECT = '/invalid-session';
