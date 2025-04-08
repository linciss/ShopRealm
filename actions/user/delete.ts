'use server';

import { revalidatePath } from 'next/cache';
import { auth, signOut } from '../../auth';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import prisma from '@/lib/db';

export const deleteAccount = async () => {
  const session = await auth();

  if (!session?.user.id) return { error: 'Lietotajs nav autorizets!' };
  const userId = session.user.id;

  try {
    //  make a transaction/bach query since if 1 fails its gonna fail all the queries so deletions can happen if an error throws up
    await prisma.$transaction(async (tx) => {
      await tx.review.deleteMany({
        where: { userId },
      });

      const cart = await tx.cart.findUnique({
        where: { userId },
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
        where: { userId },
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
        where: { userId },
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
        where: { userId },
        data: {
          userId: 'deleted-user',
        },
      });

      await tx.user.delete({
        where: { id: userId },
      });
    });

    await signOut();

    revalidatePath(`/products`);
    return { success: 'Veiksmigi izdzesta lietotajs!' };
  } catch (error) {
    // return prisma error so i dont have to query database to check if user exists
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'Nav atrasta lietotajs!' };
      return { error: 'Kļūda apstrādājot datus' };
    } else {
      return { error: 'Kļūda apstrādājot datus' };
    }
  }
};
