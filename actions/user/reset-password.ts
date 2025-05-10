'use server';

import { z } from 'zod';
import { createPasswordSchema, forgotPasswordSchema } from '../../schemas';
import {
  generateResetPasswordToken,
  verifyResetPasswordToken,
} from '@/lib/token';
import { sendResetPassword } from '../emailing/email';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signIn } from '../../auth';
import { revalidatePath } from 'next/cache';
import { AuthError } from 'next-auth';

export const reqeustResetToken = async (
  data: z.infer<typeof forgotPasswordSchema>,
) => {
  const validateData = forgotPasswordSchema.safeParse(data);
  if (!validateData.success) {
    return {
      error: 'validationError',
    };
  }
  const { email } = validateData.data;

  try {
    const emailToLower = email.toLowerCase();

    // check if user exists
    const exists = await prisma.user.findUnique({
      where: { email: emailToLower },
    });

    if (!exists) {
      return { error: 'userNotFound' };
    }

    const token = await generateResetPasswordToken(email);

    if (!token) {
      return { error: 'cantGenerateToken' };
    }
    await sendResetPassword(token, email);

    return { success: 'resetEmailSent' };
  } catch (error) {
    console.error(error);
    return { error: 'validationError' };
  }
};

export const verifyResetToken = async (token: string) => {
  try {
    const verifiedToken = await verifyResetPasswordToken(token);

    if (!verifiedToken) {
      return {
        error: 'badToken',
      };
    }

    return { success: 'success' };
  } catch (err) {
    if (err instanceof Error) {
      console.error('Nevareja verificet:', err);
    }
    return { error: 'badToken' };
  }
};

export const resetPassword = async (
  data: z.infer<typeof createPasswordSchema>,
  token: string,
) => {
  const validateData = createPasswordSchema.safeParse(data);
  if (!validateData.success) {
    return {
      error: 'validationError',
    };
  }

  const { newPassword, newPasswordConfirm } = validateData.data;

  if (newPassword !== newPasswordConfirm) {
    return { error: 'passwordNotMatch' };
  }

  try {
    const verifiedToken = await verifyResetPasswordToken(token);

    if (!verifiedToken) {
      return {
        error: 'badToken',
      };
    }

    // check if user exists
    const user = await prisma.user.findUnique({
      where: { email: verifiedToken.email },
      select: { password: true },
    });

    if (!user) {
      return { error: 'userNotFound' };
    }

    // check if old password is new password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return { error: 'oldCantBeNew' };
    }
    // hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update user password
    await prisma.user.update({
      where: { email: verifiedToken.email },
      data: { password: hashedPassword },
    });

    // delete token
    await prisma.passwordResetToken.delete({
      where: {
        id: verifiedToken.id,
      },
    });

    await signIn('credentials', {
      email: verifiedToken.email,
      password: newPassword,
      redirectTo: '/products',
    });

    revalidatePath('/products');

    return { success: 'passwordReset' };
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
