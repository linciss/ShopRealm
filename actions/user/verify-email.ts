'use server';
import prisma from '@/lib/db';
import { generateToken, verifyToken } from '@/lib/token';
import { auth } from '../../auth';
import { sendVerifyEmail } from '../emailing/email';

export const requestVerification = async () => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  try {
    const email = session.user.email;

    if (!email) return { error: 'authError' };

    const token = await generateToken(email);

    await sendVerifyEmail(token, email);

    return {
      email,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error('Nevareja verificet:', err);
    }
    return { error: 'cantVerify' };
  }
};

export const verifyUserEmail = async (token: string) => {
  try {
    const verifiedToken = await verifyToken(token);

    if (!verifiedToken) {
      return {
        error: 'badToken',
      };
    }

    // verify user email if token is valid
    await prisma.user.update({
      where: { email: verifiedToken.email },
      data: { emailVerified: true },
    });

    // delete since we dont need it anymore
    await prisma.verificationToken.delete({
      where: {
        id: verifiedToken.id,
      },
    });

    return { success: 'verified' };
  } catch (err) {
    if (err instanceof Error) {
      console.error('Nevareja verificet:', err);
    }
    return { error: 'cantVerify' };
  }
};
