'use server';

import prisma from '@/lib/db';
import { auth } from '../../auth';
import { getStoreId } from '../../data/store';
import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const deleteProduct = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'Kluda!' };

  try {
    const storeId = await getStoreId();

    if (!storeId) return { error: 'Kluda' };

    // prisma transaction/bachquery since i also want to delete cart items completely forgot lol
    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({
        where: { productId },
      });

      await tx.product.delete({
        where: { id: productId, storeId: storeId },
      });
    });

    revalidatePath('/store/products');
    return { success: 'izdzest produkts!~' };
  } catch (error) {
    // return prisma error so i dont have to query database to check if product exists
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'Nav atrasts produkts!' };
      console.log(error);
      return { error: 'Kļūda apstrādājot datus prisma' };
    } else {
      console.log(error);
      return { error: 'Kļūda apstrādājot datus' };
    }
  }
};
