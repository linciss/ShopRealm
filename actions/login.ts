'use server';

import { z } from 'zod';
import { signInSchema } from '../schemas';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';
import { DEFAULT_SIGNIN_REDIRECT } from '../routes';

export const login = async (data: z.infer<typeof signInSchema>) => {
  const { email, password } = data;

  console.log(data);

  try {
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
