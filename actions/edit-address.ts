'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { addressInfoSchema } from '../schemas';

export const editUserAddress = async (
  data: z.infer<typeof addressInfoSchema>,
  userId: string,
) => {
  const validateData = addressInfoSchema.safeParse(data);

  if (!validateData.success) {
    return { error: 'Kluda mainot datus!' };
  }

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

  return { success: 'Informacija samainita!' };
};
