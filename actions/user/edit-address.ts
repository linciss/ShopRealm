'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { addressInfoSchema } from '../../schemas';
import { auth } from '../../auth';

export const editUserAddress = async (
  data: z.infer<typeof addressInfoSchema>,
) => {
  const validateData = addressInfoSchema.safeParse(data);
  const session = await auth();

  if (!session?.user?.id) return { error: 'authError' };

  if (!validateData.success) {
    return { error: 'validationError' };
  }

  try {
    const userId = session?.user?.id;

    const { street, city, country, postalCode } = validateData.data;

    console.log(street, city, country, postalCode);

    await prisma.address.update({
      where: { userId: userId },
      data: {
        street,
        city,
        country,
        postalCode,
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
