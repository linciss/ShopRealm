'use server';

import prisma from '@/lib/db';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const deleteReview = async (reviewId: string) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'Lietotajs nav autorizets!' };

  const userId = session.user.id;

  try {
    const deletedReview = await prisma.review.delete({
      where: {
        id: reviewId,
        userId: userId,
      },
      select: {
        productId: true,
      },
    });

    revalidatePath(`/products/${deletedReview?.productId}`);

    return { success: 'Veiksmigi izdzesta atsuaksme!' };
  } catch (error) {
    // return prisma error so i dont have to query database to check if product exists
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'Nav atrasta atsauksme!' };
      return { error: 'Kļūda apstrādājot datus' };
    } else {
      return { error: 'Kļūda apstrādājot datus' };
    }
  }
};
