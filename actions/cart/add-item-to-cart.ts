'use server';
import prisma from '@/lib/db';
import { auth } from '../../auth';
import { getUserCart } from '../../data/cart';
import { revalidatePath } from 'next/cache';

// Add to cart functionm
export const addItemToCart = async (productId: string, quantity = 1) => {
  const session = await auth();

  if (quantity < 1) {
    return { error: '1item' };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!session?.user.id)
      return {
        error: 'authError',
      };

    if (!product) {
      return { error: 'prodNotFound' };
    } else if (product.quantity <= 0) {
      return { error: 'prodNotAvailable' };
    }

    const cart = await getUserCart();

    if (!cart) return { error: 'error' };

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        productId,
        cartId: cart.id,
      },
    });

    if (existingCartItem) {
      const newQuantity = Math.min(
        product.quantity,
        existingCartItem.quantity + quantity,
      );

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
        },
      });
      return { success: 'incrementedQuantity' };
    }

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    revalidatePath('/cart');
    return { success: 'addedToCart' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Kļūda: ', error.stack);
    }
    return { error: 'validationError' };
  }
};
