import authConfig from '../auth.config';
import NextAuth from 'next-auth';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;

  console.log(isLoggedIn, 'is logged in');

  console.log(req.auth, 'sss');
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
