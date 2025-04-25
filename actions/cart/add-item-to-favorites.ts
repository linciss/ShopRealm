'use server';
import prisma from '@/lib/db';
import { auth } from '../../auth';
import { getUserFavoriteList } from '../../data/favorites';
import { revalidatePath } from 'next/cache';

// Add to favorite list functionm
export const addItemToFavorites = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { error: 'prodNotFound' };
    }

    const favoriteList = await getUserFavoriteList();

    if (!favoriteList) return { error: 'error' };

    const existingFavoriteItem = await prisma.favoriteItem.findFirst({
      where: {
        productId,
        favoriteListId: favoriteList.id,
      },
    });

    if (existingFavoriteItem) {
      await prisma.favoriteItem.delete({
        where: {
          id: existingFavoriteItem.id,
        },
      });
      return { success1: 'removedFromFav' };
    }

    await prisma.favoriteItem.create({
      data: {
        favoriteListId: favoriteList.id,
        productId: product.id,
      },
    });

    revalidatePath('/favorites');

    return { success: 'addedToFav' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'validationError' };
  }
};
