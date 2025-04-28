import prisma from '@/lib/db';
import { auth } from '../auth';

export const getUserCart = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      const cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
      });
      return cart;
    }

    return cart;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getCartProducts = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const userId = session.user.id;

    const userCart = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        emailVerified: true,
        cart: {
          select: {
            cartItems: {
              select: {
                product: {
                  select: {
                    id: true,
                    image: true,
                    name: true,
                    price: true,
                    quantity: true,
                    sale: true,
                    salePrice: true,
                  },
                },
                quantity: true,
              },
            },
          },
        },
      },
    });

    if (!userCart) return;

    return {
      cartProducts: userCart.cart?.cartItems,
      verifiedEmail: userCart.emailVerified,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};
