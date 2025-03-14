'use server';

import { z } from 'zod';
import { personalInfoSchema } from '../schemas';
import prisma from '@/lib/db';
import { auth } from '../auth';

export const editUserProfile = async (
  data: z.infer<typeof personalInfoSchema>,
) => {
  const validateData = personalInfoSchema.safeParse(data);
  const session = await auth();

  if (!session?.user?.id) return { error: 'Kluda!' };

  try {
    const userId = session?.user.id;

    if (!validateData.success) {
      return { error: 'Kluda mainot datus!' };
    }

    const { name, lastName, phone } = validateData.data;

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        lastName,
        phone,
      },
    });

    return { success: 'Informacija samainita!' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};
