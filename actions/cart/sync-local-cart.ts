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

  if (!session?.user.id) return { error: 'authError' };

  try {
    const cart = await getUserCart();

    if (!cart) return { error: 'cartError' };

    for (const item of localProducts) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { id: true, price: true, quantity: true },
      });

      if (!product) continue;

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: item.id,
        },
      });

      if (existingItem) {
        // validate so dont exceed the max quantity
        const validatedQuantity = Math.min(
          existingItem.quantity + item.quantity,
          product.quantity,
        );
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: validatedQuantity },
        });
      } else {
        const validatedQuantity = Math.min(item.quantity, product.quantity);
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.id,
            quantity: validatedQuantity,
          },
        });
      }
    }

    const updatedCartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      select: {
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            quantity: true,
            sale: true,
            salePrice: true,
          },
        },
      },
    });

    revalidatePath('/cart');
    return { success: 'cartSynced', cartItems: updatedCartItems };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: 'validationError' };
  }
};
