import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from './schemas/index';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './data/user';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validateFields = signInSchema.safeParse(credentials);

        if (!validateFields.success) {
          return null;
        }

        const { email, password } = validateFields.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = bcrypt.compare(password, user.password);

        console.log(passwordMatch, 'opasswortd match');
        if (!passwordMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
