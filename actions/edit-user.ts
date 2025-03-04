'use server';

import { z } from 'zod';
import { personalInfoSchema } from '../schemas';
import prisma from '@/lib/db';

export const editUserProfile = async (
  data: z.infer<typeof personalInfoSchema>,
  userId: string,
) => {
  const validateData = personalInfoSchema.safeParse(data);

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
};
