'use server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const getLocalCartProducts = async (productIds: string[]) => {
  try {
    if (!productIds.length) return { error: 'Kluda!' };

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        name: true,
        id: true,
        price: true,
        image: true,
      },
    });

    revalidatePath('/cart');
    return { products };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: 'KLUDA!' };
  }
};
