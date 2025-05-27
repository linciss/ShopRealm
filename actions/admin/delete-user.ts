'use server';

import prisma from '@/lib/db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';

export const deleteUser = async (id: string) => {
  const session = await auth();
  if (!session?.user.admin) return { error: 'authError' };

  if (session.user.id === id) {
    return { error: 'cannotDeleteYourself' };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { adminPrivileges: true },
    });

    if (!user) {
      return { error: 'userNotFound' };
    }

    if (session.user.adminLevel !== 'SUPER_ADMIN' && user?.adminPrivileges) {
      return { error: 'cannotDeleteAdmin' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.review.updateMany({
        where: { userId: id },
        data: {
          userId: '6835d5809150feb71e83d922',
        },
      });
      const cart = await tx.cart.findUnique({
        where: { userId: id },
        select: { id: true },
      });

      if (cart) {
        await tx.cart.delete({
          where: { id: cart.id },
        });
      }

      const favoriteList = await tx.favoriteList.findUnique({
        where: { userId: id },
        select: { id: true },
      });

      if (favoriteList) {
        await tx.favoriteList.delete({
          where: { id: favoriteList.id },
        });
      }

      const store = await tx.store.findFirst({
        where: { userId: id },
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
            where: { id: id },
          });
        } else {
          await tx.store.update({
            where: { userId: id },
            data: {
              active: false,
            },
          });
        }
      }

      await tx.user.update({
        where: { id },
        data: {
          deleted: true,
        },
      });
    });

    revalidatePath('/admin/users');

    return { success: 'userDeleted' };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'userNotFound' };
    }
    console.log(error);
    return { error: 'validationError' };
  }
};
