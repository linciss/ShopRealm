'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { storeSchema } from '../schemas';
import { checkHasStore } from '../data/store';
import { auth } from '../auth';

export const editUserStore = async (data: z.infer<typeof storeSchema>) => {
  const session = await auth();
  const validateData = storeSchema.safeParse(data);

  if (!session?.user) return { error: 'Kluda!' };

  if (!validateData.success) {
    return { error: 'Kluda mainot datus!' };
  }
  try {
    const userId = session?.user?.id;

    const { name, description, phone } = validateData.data;

    await prisma.store.update({
      where: { userId },
      data: {
        name,
        description,
        storePhone: phone,
      },
    });

    if (!(await checkHasStore(false))) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          hasStore: true,
        },
      });
    }

    return { success: 'Informacija samainita!' };
  } catch (err) {
    console.log(err);
    return { error: 'Kļūda apstrādājot datus' };
  }
};
