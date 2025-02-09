'use server';

import { z } from 'zod';
import { signInSchema } from '../schemas';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';
import { DEFAULT_SIGNIN_REDIRECT } from '../routes';

// login server action
export const login = async (data: z.infer<typeof signInSchema>) => {
  const { email, password } = data;

  try {
    // calls credential authorization provider to sign in and calls signIn afterwards to double check
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_SIGNIN_REDIRECT,
    });
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case 'CredentialsSignin':
          return { error: 'Nepareia parole vai epasts!' };
        default:
          return { error: 'Error!' };
      }
    }
    throw e;
  }

  return { success: 'Logged in!', error: undefined };
};
