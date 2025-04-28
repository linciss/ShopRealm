'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '../../auth';
import prisma from '@/lib/db';
import { getUserCart } from '../../data/cart';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const removeItem = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  try {
    const cart = await getUserCart();

    if (!cart) return { error: 'cartError' };

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });

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

    return {
      success: 'removed',
      cartItems: updatedCartItems,
    };
  } catch (error) {
    // return prisma error so i dont have to query database to check if product exists
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'prodNotFound!' };
      return { error: 'validationError' };
    } else {
      return { error: 'validationError' };
    }
  }
};
