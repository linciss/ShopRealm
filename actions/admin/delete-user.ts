'use server';

import prisma from '@/lib/db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';

export const deleteUser = async (id: string) => {
  const session = await auth();
  if (!session?.user.id) return { error: 'authError' };
  if (!session.user.admin) return { error: 'authError' };

  if (session.user.id === id) {
    return { error: 'cannotDeleteYourself' };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { adminPrivileges: true },
    });

    if (session.user.adminLevel !== 'SUPER_ADMIN' && user?.adminPrivileges) {
      return { error: 'cannotDeleteAdmin' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.review.deleteMany({
        where: { userId: id },
      });

      const cart = await tx.cart.findUnique({
        where: { userId: id },
        select: { id: true },
      });

      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        await tx.cart.delete({
          where: { id: cart.id },
        });
      }

      const favoriteList = await tx.favoriteList.findUnique({
        where: { userId: id },
        select: { id: true },
      });

      if (favoriteList) {
        await tx.favoriteItem.deleteMany({
          where: { favoriteListId: favoriteList.id },
        });

        await tx.favoriteList.delete({
          where: { id: favoriteList.id },
        });
      }

      const store = await tx.store.findFirst({
        where: { userId: id },
        select: { id: true },
      });

      if (store) {
        await tx.product.deleteMany({
          where: { storeId: store.id },
        });

        await tx.store.delete({
          where: { id: store.id },
        });
      }

      await tx.order.updateMany({
        where: { userId: id },
        data: {
          userId: 'deleted-user',
        },
      });

      await tx.address.delete({
        where: { userId: id },
      });

      await tx.user.delete({
        where: { id },
      });
    });

    revalidatePath('/admin/users');

    return { success: 'userDeleted' };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'userNotFound' };
      return { error: 'validationError' };
    }
    return { error: 'validationError' };
  }
};
