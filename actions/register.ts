'use server';
import { z } from 'zod';
import { signUpSchema } from '../schemas';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../data/user';
import prisma from '@/lib/db';
import { signIn } from '../auth';

const SALT_ROUNDS = 10;

// register server action that creates a new user in the db
export const register = async (data: z.infer<typeof signUpSchema>) => {
  const validateData = signUpSchema.safeParse(data);

  if (!validateData.success) {
    return {
      error: 'Kļūda validējot datus!',
    };
  }

  const { email, password, passwordConfirmation, name, lastName } =
    validateData.data;

  const existingUser = await getUserByEmail(email);

  //  checks if user already exists
  if (existingUser) {
    return { error: 'Lietotājs jau eksistē!' };
  }

  // checks if passwords match
  if (password !== passwordConfirmation) {
    return { error: 'Paroles nesakrīt!' };
  }
  // hashes the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    // creates a new user in the db
    await prisma.user.create({
      data: {
        name,
        lastName,
        email,
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
      redirect: false,
    });

    return { success: 'Veiksmigi izveidots k0onts!~' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};
