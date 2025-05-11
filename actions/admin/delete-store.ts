'use server';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth } from '../../auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const deleteStore = async (id: string) => {
  const session = await auth();
  if (!session?.user.id) return { error: 'authError' };
  if (!session.user.admin) return { error: 'authError' };
  try {
    const store = await prisma.store.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!store) return { error: 'storeNotFound' };

    await prisma.$transaction(async (tx) => {
      await tx.product.deleteMany({
        where: { storeId: id },
      });

      await tx.store.delete({
        where: { id },
      });

      await tx.user.update({
        where: {
          id: store.userId,
        },
        data: {
          hasStore: false,
          role: 'SHOPPER',
        },
      });
    });
    revalidatePath('/admin/stores');
    return { success: 'storeDeleted' };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'storeNotFound' };
      return { error: 'validationError' };
    }
    return { error: 'validationError' };
  }
};
