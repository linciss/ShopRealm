'use server';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth } from '../../auth';
import prisma from '@/lib/db';
import { getStoreId } from '../../data/store';

export const deleteStore = async () => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };
  try {
    const storeId = await getStoreId();

    if (!storeId) return { error: 'authError' };

    await prisma.$transaction(async (tx) => {
      await tx.product.deleteMany({
        where: { storeId },
      });

      await tx.store.delete({
        where: { id: storeId },
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
