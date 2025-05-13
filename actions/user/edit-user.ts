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

  if (!session?.user?.id) return { error: 'authError' };

  try {
    const userId = session?.user.id;

    if (!validateData.success) {
      return { error: 'validationError' };
    }

    const { name, lastName, phone } = validateData.data;

    const exisitingUser = await prisma.user.findMany({
      where: {
        phone,
        id: {
          not: userId,
        },
      },
    });

    if (exisitingUser.length > 0) {
      return { error: 'phoneExists' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        lastName,
        phone,
      },
    });

    return { success: 'changedInfo' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'validationError' };
  }
};
