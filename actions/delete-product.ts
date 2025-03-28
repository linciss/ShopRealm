'use server';

import prisma from '@/lib/db';
import { auth } from '../auth';
import { getStoreId } from '../data/store';

export const deleteProduct = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'Kluda!' };

  try {
    const storeId = await getStoreId();

    if (!storeId) return { error: 'Kluda' };

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { storeId: true },
    });

    if (!product) return { error: 'Kluda! nav atrast produkts' };

    if (storeId !== product.storeId)
      return { error: 'Nav jusu veiakal produkts' };

    await prisma.product.delete({
      where: { id: productId },
    });

    return { success: 'izdzest produkts!~' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};
