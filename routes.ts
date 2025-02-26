export const publicRoutes = [
  '/',
  '/about',
  '/products',
  '/products/[id]',
  '/sale',
  '/new',
  '/categories',
];
export const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
];

export const privateRoutes = ['/profile'];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_SIGNOUT_REDIRECT = '/products';

export const DEFAULT_SIGNIN_REDIRECT = '/products';

export const DEFAULT_SIGNUP_REDIRECT = '/products';
