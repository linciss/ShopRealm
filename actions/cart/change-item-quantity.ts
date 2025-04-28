'use server';

import prisma from '@/lib/db';
import { auth } from '../../auth';
import { getUserCart } from '../../data/cart';
import { revalidatePath } from 'next/cache';

export const changeItemQuantity = async (
  productId: string,
  quantity: number,
) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  try {
    const cart = await getUserCart();

    if (!cart) return { error: 'cartError' };

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { quantity: true, name: true },
    });

    if (!product) return { error: 'prodNotFound' };

    const newQuantity = Math.min(quantity, product.quantity);

    await prisma.cartItem.updateMany({
      where: { productId, cartId: cart.id },
      data: {
        quantity: newQuantity,
      },
    });

    revalidatePath('/cart');
    return { success: 'quantityChanged' };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: 'validationError' };
  }
};
