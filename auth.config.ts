import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from './schemas/index';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './data/user';

export default {
  providers: [
    Credentials({
      // the authorize function that is  called when a user tries to sign in
      async authorize(credentials) {
        // validates the fields
        const validateFields = signInSchema.safeParse(credentials);

        if (!validateFields.success) {
          return null;
        }

        const { email, password } = validateFields.data;

        // gets the user by email
        const user = await getUserByEmail(email);

        // if no user or password is found returns null
        if (!user || !user.password) {
          return null;
        }
        //  checks if the password matches the hashed password in the db
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

        // returns the user if everything is correct
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasStore: user.hasStore,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.hasStore = user.hasStore;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.hasStore = token.hasStore as boolean;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
