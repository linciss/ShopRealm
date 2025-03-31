'use server';

import prisma from '@/lib/db';
import { auth } from '../../auth';
import { getUserCart } from '../../data/cart';
import { revalidatePath } from 'next/cache';

interface LocalProducts {
  id: string;
  quantity: number;
}

export const syncCart = async (localProducts: LocalProducts[]) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'Lietotajs nav autorizets!' };

  try {
    const cart = await getUserCart();

    if (!cart) return { error: 'Kluda!' };

    for (const item of localProducts) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { id: true, price: true },
      });

      if (!product) continue;

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: item.id,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.id,
            quantity: item.quantity,
          },
        });
      }
    }

    revalidatePath('/cart');
    return { success: 'Grozs sinhronizets!' };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: 'Kluda apstradajot datus!' };
  }
};
