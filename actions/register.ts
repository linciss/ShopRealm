'use server';
import { z } from 'zod';
import { signUpSchema } from '../schemas';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../data/user';
import prisma from '@/lib/db';

const SALT_ROUNDS = 10;

// register server action that creates a new user in the db
export const register = async (data: z.infer<typeof signUpSchema>) => {
  const validateData = signUpSchema.safeParse(data);

  if (!validateData.success) {
    return { error: 'Nav dati!' };
  }

  const { email, password, passwordConfirmation } = validateData.data;

  // checks if passwords match
  if (password !== passwordConfirmation) {
    return { error: 'Paroles nesakrīt!' };
  }
  // hashes the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const existingUser = await getUserByEmail(email);

  //  checks if user already exists
  if (existingUser) {
    return { error: 'Lietotājs jau eksistē!' };
  }

  // creates a new user in the db
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return { success: 'Lietotājs izveidots!' };
};
