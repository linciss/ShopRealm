'use server';

import { z } from 'zod';
import { signInSchema } from '../../schemas';
import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import prisma from '@/lib/db';
import { DEFAULT_SIGNIN_REDIRECT } from '../../routes';

// login server action
export const login = async (
  data: z.infer<typeof signInSchema>,
  redirect: boolean,
) => {
  const validateData = signInSchema.safeParse(data);

  if (!validateData.success) {
    return {
      error: 'validationError',
    };
  }

  const { email, password } = validateData.data;

  try {
    const emailToLower = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: emailToLower },
    });

    if (!user) {
      return { error: 'wrongPassword' };
    }

    // calls credential authorization provider to sign in and calls signIn afterwards to double check
    await signIn('credentials', {
      email: emailToLower,
      password,
      redirectTo: redirect ? '/create-store' : DEFAULT_SIGNIN_REDIRECT,
    });

    return { success: 'signedIn' };
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case 'CredentialsSignin':
          return { error: 'wrongEmailOrPassword' };
        default:
          return { error: 'validationError' };
      }
    }
    throw e;
  }
};
