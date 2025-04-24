import prisma from '@/lib/db';
import { auth } from '../auth';

export const getUserFavoriteList = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const favoriteList = await prisma.favoriteList.findUnique({
      where: { userId: session.user.id },
    });

    if (!favoriteList) {
      const favoriteList = await prisma.favoriteList.create({
        data: {
          userId: session.user.id,
        },
      });
      return favoriteList;
    }

    return favoriteList;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getFavoriteItems = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const favoriteList = await prisma.favoriteList.findUnique({
      where: { userId: session.user.id },
      select: {
        products: {
          select: {
            productId: true,
          },
        },
      },
    });

    return favoriteList?.products;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const isItemFavorite = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const isFav = await prisma.favoriteList.findUnique({
      where: {
        userId: session.user.id,
        products: {
          some: {
            productId,
          },
        },
      },
    });

    if (!isFav) return false;

    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getFavoriteProducts = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const favoriteList = await prisma.favoriteList.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
      },
    });

    if (!favoriteList?.id) return;

    const favoriteItems = await prisma.favoriteItem.findMany({
      where: { favoriteListId: favoriteList?.id },
      select: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
            reviews: {
              select: {
                rating: true,
              },
            },
            quantity: true,
            sale: true,
            salePrice: true,
          },
        },
      },
    });

    if (favoriteItems.length === 0) return;

    return favoriteItems;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};
