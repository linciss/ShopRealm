'use server';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth, signOut } from '../../auth';
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
      const storeProducts = await tx.product.findMany({
        where: { storeId },
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
          where: { id: storeId },
        });
      } else {
        await tx.store.update({
          where: { id: storeId },
          data: {
            active: false,
            deleted: true,
          },
        });
      }

      await tx.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          hasStore: false,
          role: 'SHOPPER',
        },
      });
    });

    await signOut({
      redirectTo: '/auth/sign-in',
    });

    return { success: true };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'storeNotFound' };
    }
    console.log(error);
    return { error: 'validationError' };
  }
};
