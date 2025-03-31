'use server';
import prisma from '@/lib/db';
import { auth } from '../../auth';
import { getUserCart } from '../../data/cart';

// Add to cart functionm
export const addItemToCart = async (productId: string, quantity = 1) => {
  const session = await auth();

  if (quantity < 1) {
    return { error: 'Jabut vismaz 1 gabalam!' };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!session?.user.id)
      return {
        error: 'Lietotajs nav autorizets!',
      };

    if (!product) {
      return { error: 'Produkts nav atrasts' };
    } else if (product.quantity <= 0) {
      return { error: 'Prece nav pieejama' };
    }

    const cart = await getUserCart();

    if (!cart) return { error: 'Kluda!' };

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        productId,
        cartId: cart.id,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
      return { success: 'Produkta daudzums papildinats!' };
    }

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    return { success: 'Pievienots grozam!' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Kļūda: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};
