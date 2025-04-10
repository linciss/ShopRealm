'use server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { getUserCart } from '../../data/cart';

export const clearCart = async () => {
  const session = await auth();

  if (!session?.user.id) return { error: 'Lietotajs nav autoriz' };

  try {
    const cart = await getUserCart();

    if (!cart) return { error: 'Kluda ar grozu!' };

    const updatedCartItems = await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    revalidatePath('/cart');

    return {
      success: 'Grozs iztirits!',
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
