export const shopperRoutes = [
  '/cart',
  '/checkout',
  '/products',
  '/products/[id]',
  '/sale',
  '/new',
  '/categories',
];

export const publicRoutes = ['/', '/about', ...shopperRoutes];

export const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
];

export const storeRoutes = ['/store', '/store/items', '/store/create'];

export const privateRoutes = ['/profile', ...storeRoutes];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_SIGNOUT_REDIRECT = '/products';

export const DEFAULT_SIGNIN_REDIRECT = '/products';

export const DEFAULT_SIGNUP_REDIRECT = '/products';
