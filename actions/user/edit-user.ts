'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { personalInfoSchema } from '../../schemas';
import { auth } from '../../auth';

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

    const { name, lastName } = validateData.data;

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        lastName,
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
