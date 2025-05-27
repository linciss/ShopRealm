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
          userId: '6835d5809150feb71e83d922',
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
        const storeProducts = await tx.product.findMany({
          where: { storeId: store.id },
          select: { id: true },
        });

        await tx.cartItem.deleteMany({
          where: {
            productId: { in: storeProducts.map((p) => p.id) },
          },
        });

        await tx.favoriteItem.deleteMany({
          where: {
            productId: { in: storeProducts.map((p) => p.id) },
          },
        });

        const productsWithOrders = await tx.orderItem.findMany({
          where: {
            productId: { in: storeProducts.map((p) => p.id) },
          },
          select: { productId: true },
        });

        const productsWithOrdersSet = new Set(
          productsWithOrders.map((p) => p.productId),
        );

        const productsWithoutOrders = storeProducts.filter(
          (p) => !productsWithOrdersSet.has(p.id),
        );

        if (productsWithOrders.length > 0) {
          await tx.product.updateMany({
            where: {
              id: { in: productsWithOrders.map((p) => p.productId) },
            },
            data: {
              isActive: false,
              quantity: 0,
              deleted: true,
              storeId: null,
            },
          });
        }

        if (productsWithoutOrders.length > 0) {
          await tx.product.deleteMany({
            where: {
              id: { in: productsWithoutOrders.map((p) => p.id) },
            },
          });
        }

        if (productsWithOrders.length === 0) {
          await tx.store.delete({
            where: { id: store.id },
          });
        } else {
          await tx.store.update({
            where: { id: store.id },
            data: {
              active: false,
            },
          });
        }
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          deleted: true,
        },
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
    console.log(error);
    return { error: 'validationError' };
  }
};
