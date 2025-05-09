'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { storeSchema } from '../../schemas';
import { checkHasStore } from '../../data/store';
import { auth } from '../../auth';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export const editUserStore = async (data: z.infer<typeof storeSchema>) => {
  const session = await auth();
  const validateData = storeSchema.safeParse(data);

  if (!session?.user.id) return { error: 'authError' };

  if (!validateData.success) {
    return { error: 'validationError' };
  }
  try {
    const userId = session?.user?.id;

    const { name, description, phone } = validateData.data;

    if (!(await checkHasStore(false))) {
      await prisma.store.create({
        data: {
          name,
          description,
          storePhone: phone,
          user: {
            connect: { id: userId },
          },
          slug: slugify(name),
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          hasStore: true,
        },
      });
      return { success1: 'storeCreated' };
    }

    await prisma.store.update({
      where: { userId },
      data: {
        name,
        description,
        storePhone: phone,
        slug: slugify(name),
      },
    });

    revalidatePath('/store');
    revalidatePath('/profile');

    return { success: 'changedInfo' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'validationError' };
  }
};
