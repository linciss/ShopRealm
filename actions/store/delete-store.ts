'use server';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth } from '../../auth';
import prisma from '@/lib/db';
import { getStoreId } from '../../data/store';
import { z } from 'zod';
import { deleteConfirmationSchema } from '../../schemas';
import bcrypt from 'bcryptjs';

export const deleteStore = async (
  data: z.infer<typeof deleteConfirmationSchema>,
) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  const validateData = deleteConfirmationSchema.safeParse(data);

  if (!validateData.success) {
    return {
      error: 'validationError',
    };
  }

  const { password } = validateData.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.user.id },
      select: { id: true, password: true },
    });
    if (!user) return { error: 'userNotFound' };

    const matching = await bcrypt.compare(password, user.password);

    if (!matching) return { error: 'invalidPassword' };

    const storeId = await getStoreId();

    if (!storeId) return { error: 'authError' };

    await prisma.$transaction(async (tx) => {
      await tx.product.deleteMany({
        where: { storeId },
      });

      await tx.store.delete({
        where: { id: storeId },
      });

      await tx.user.update({
        where: { id: session?.user.id },
        data: {
          hasStore: false,
          role: 'SHOPPER',
        },
      });
    });

    return { success: true };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'storeNotFound' };
      return { error: 'validationError' };
    }
    return { error: 'validationError' };
  }
};
