'use server';

import prisma from '@/lib/db';
import { auth } from '../../auth';
import { getUserCart } from '../../data/cart';

export const changeItemQuantity = async (
  productId: string,
  quantity: number,
) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'Lietotajs nav autorizets!' };

  try {
    const cart = await getUserCart();

    if (!cart) return { error: 'Kluda ar grozu!' };

    await prisma.cartItem.updateMany({
      where: { productId, cartId: cart.id },
      data: {
        quantity: quantity,
      },
    });

    return { success: 'Samainits daudzums!' };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: 'Kluda validejot datus' };
  }
};
