'use server';

import prisma from '@/lib/db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { cookies } from 'next/headers';

export const incrementView = async (productId: string) => {
  try {
    // check if product has already been viewed so cant spam
    const viewedProducts = (await cookies()).get('viewedProducts')?.value
      ? JSON.parse((await cookies()).get('viewedProducts')!.value)
      : [];

    if (!viewedProducts.includes(productId)) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          views: { increment: 1 },
        },
      });

      // sets the viewed product in cookies so cant spam
      (await cookies()).set(
        'viewedProducts',
        JSON.stringify([...viewedProducts, productId]),
        { maxAge: 60 * 60 * 24 },
      );
    }

    return { success: true };
  } catch (error) {
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
