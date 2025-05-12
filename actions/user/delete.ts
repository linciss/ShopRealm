'use server';

import { revalidatePath } from 'next/cache';
import { auth, signOut } from '../../auth';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import prisma from '@/lib/db';
import { z } from 'zod';
import { deleteConfirmationSchema } from '../../schemas';
import bcrypt from 'bcryptjs';

export const deleteAccount = async (
  data: z.infer<typeof deleteConfirmationSchema>,
) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };
  const userId = session.user.id;

  const validateData = deleteConfirmationSchema.safeParse(data);

  if (!validateData.success) {
    return {
      error: 'validationError',
    };
  }

  const { password } = validateData.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });
    if (!user) return { error: 'userNotFound' };
    const matching = await bcrypt.compare(password, user.password);

    if (!matching) return { error: 'invalidPassword' };

    //  make a transaction/bach query since if 1 fails its gonna fail all the queries so deletions can happen if an error throws up
    await prisma.$transaction(async (tx) => {
      await tx.review.updateMany({
        where: { userId },
        data: {
          userId: 'deleted-user',
        },
      });
      const cart = await tx.cart.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (cart) {
        await tx.cart.delete({
          where: { id: cart.id },
        });
      }

      const favoriteList = await tx.favoriteList.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (favoriteList) {
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

    try {
      // in try catch since its gonna throw an error because user does not exist anymore
      await signOut();
    } catch (err) {
      return { success: 'signOut', err };
    }

    revalidatePath(`/products`);
    return { success: 'deleteAccountSuccess' };
  } catch (error) {
    // return prisma error so i dont have to query database to check if user exists
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'userNotFound' };
      return { error: 'validationError' };
    }
    return { error: 'validationError' };
  }
};
