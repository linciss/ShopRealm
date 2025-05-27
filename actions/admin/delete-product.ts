'use server';

import prisma from '@/lib/db';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const deleteProduct = async (id: string) => {
  const session = await auth();

  if (!session?.user.admin) return { error: 'authError' };

  try {
    await prisma.$transaction(async (tx) => {
      const ordersWithProduct = await tx.orderItem.findFirst({
        where: { productId: id },
      });

      if (ordersWithProduct) {
        await tx.product.update({
          where: { id },
          data: {
            isActive: false,
            quantity: 0,
            deleted: true,
          },
        });
      } else {
        await tx.product.delete({ where: { id } });
      }
      await tx.cartItem.deleteMany({ where: { productId: id } });
      await tx.favoriteItem.deleteMany({ where: { productId: id } });
      await tx.review.deleteMany({ where: { productId: id } });
    });

    revalidatePath('/admin/products');

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
