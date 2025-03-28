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
