'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '../../auth';
import prisma from '@/lib/db';
import { getUserCart } from '../../data/cart';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const removeItem = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'Lietotjas nav autorizets!' };

  try {
    const cart = await getUserCart();

    if (!cart) return { error: 'Kluda ar grozu!' };

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });

    revalidatePath('/cart');

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
          },
        },
      },
    });

    revalidatePath('/cart');

    return {
      success: 'izdzests produkts no groza!',
      cartItems: updatedCartItems,
    };
  } catch (error) {
    // return prisma error so i dont have to query database to check if product exists
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'Nav atrasts produkts!' };
      return { error: 'Kļūda apstrādājot datus' };
    } else {
      return { error: 'Kļūda apstrādājot datus' };
    }
  }
};
