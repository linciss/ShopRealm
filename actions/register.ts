'use server';
import { z } from 'zod';
import { signUpSchema } from '../schemas';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../data/user';
import prisma from '@/lib/db';

const SALT_ROUNDS = 10;

export const register = async (data: z.infer<typeof signUpSchema>) => {
  const validateData = signUpSchema.safeParse(data);

  if (!validateData.success) {
    return { error: 'Nav dati!' };
  }

  const { email, password, passwordConfirmation } = validateData.data;

  if (password !== passwordConfirmation) {
    return { error: 'Paroles nesakrīt!' };
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Lietotājs jau eksistē!' };
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return { success: 'Lietotājs izveidots!' };
};
