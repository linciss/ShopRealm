'use server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import prisma from '@/lib/db';

import { AuthError } from 'next-auth';
import { DEFAULT_SIGNIN_REDIRECT } from '../../routes';
import { signIn } from '../../auth';
import { getUserByEmail } from '../../data/user';
import { signUpSchema } from '../../schemas';

const SALT_ROUNDS = 10;

// register server action that creates a new user in the db
export const register = async (
  data: z.infer<typeof signUpSchema>,
  redirect: boolean,
) => {
  const validateData = signUpSchema.safeParse(data);

  if (!validateData.success) {
    return {
      error: 'validationError',
    };
  }

  const { email, password, passwordConfirmation, name, lastName } =
    validateData.data;

  const emailToLower = email.toLowerCase();

  const existingUser = await getUserByEmail(emailToLower);

  //  checks if user already exists
  if (existingUser && !existingUser.deleted) {
    return { error: 'alreadyExists' };
  }

  // checks if passwords match
  if (password !== passwordConfirmation) {
    return { error: 'passwordNotMatch' };
  }
  // hashes the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  if (existingUser && existingUser.deleted) {
    try {
      await prisma.user.update({
        where: { email: emailToLower },
        data: {
          deleted: false,
          name,
          lastName,
          password: hashedPassword,
          emailVerified: false,
          hasStore: false,
          createdAt: new Date(),
          role: 'SHOPPER',
          address: {
            create: {
              street: '',
              city: '',
              country: '',
              postalCode: '',
            },
          },
        },
      });
      return { success: 'reactivated' };
    } catch (error) {
      console.error('Error reactivating user:', error);
      return { error: 'reactivationError' };
    }
  }

  try {
    // creates a new user in the db
    await prisma.user.create({
      data: {
        name,
        lastName,
        email: emailToLower,
        password: hashedPassword,
        address: {
          create: {
            street: '',
            city: '',
            country: '',
            postalCode: '',
          },
        },
      },
      include: {
        address: true,
      },
    });

    await signIn('credentials', {
      email,
      password,
      redirectTo: redirect ? '/create-store' : DEFAULT_SIGNIN_REDIRECT,
    });

    return { success: 'registered' };
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case 'CredentialsSignin':
          return { error: 'wrongEmailOrPassword' };
        default:
          return { error: 'error' };
      }
    } else if (e instanceof Error) {
      console.log('Error: ', e.stack);
    }

    throw e;
  }
};
