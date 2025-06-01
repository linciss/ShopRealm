'use server';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth } from '../../auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';

export const deleteStore = async (id: string) => {
  const session = await auth();
  if (!session?.user.admin) return { error: 'authError' };
  try {
    const store = await prisma.store.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!store) return { error: 'storeNotFound' };

    await prisma.$transaction(async (tx) => {
      const storeProducts = await tx.product.findMany({
        where: { storeId: id },
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
          where: { id: id },
        });
      } else {
        const deletedUserId = randomBytes(12).toString('hex');
        await tx.store.update({
          where: { id: id },
          data: {
            active: false,
            userId: deletedUserId,
            deleted: true,
          },
        });
      }

      await tx.user.update({
        where: {
          id: store.userId as string,
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
