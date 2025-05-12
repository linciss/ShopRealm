'use server';

import prisma from '@/lib/db';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const deleteProduct = async (id: string) => {
  const session = await auth();

  if (!session?.user.admin) return { error: 'authError' };

  try {
    const ordersWithProduct = await prisma.orderItem.findFirst({
      where: { productId: id },
    });

    if (ordersWithProduct) {
      await prisma.$transaction(async (tx) => {
        await tx.cartItem.deleteMany({ where: { productId: id } });
        await tx.favoriteItem.deleteMany({ where: { productId: id } });

        await tx.product.update({
          where: { id },
          data: {
            isActive: false,
            quantity: 0,
            deleted: true,
          },
        });
      });
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.cartItem.deleteMany({ where: { productId: id } });
        await tx.favoriteItem.deleteMany({ where: { productId: id } });
        await tx.product.delete({ where: { id } });
      });
    }

    revalidatePath('/admin/products');
    revalidatePath('/cart');

    return { success: 'productDeleted' };
  } catch (error) {
    // return prisma error so i dont have to query database to check if product exists
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'prodNotFound' };
      console.log(error);
      return { error: 'validationError' };
    } else {
      console.log(error);
      return { error: 'validationError' };
    }
  }
};
