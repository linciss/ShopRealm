'use server';

import { z } from 'zod';
import { reviewSchema } from '../../schemas';
import { auth } from '../../auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const editReview = async (
  data: z.infer<typeof reviewSchema>,
  reviewId: string,
) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  const validateData = reviewSchema.safeParse(data);

  if (!validateData.success) return { error: 'validationError' };

  const { rating, comment } = validateData.data;

  const userId = session.user.id;
  try {
    const editedReview = await prisma.review.update({
      where: {
        id: reviewId,
        userId: userId,
      },
      data: {
        rating,
        comment,
      },
      select: {
        productId: true,
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    revalidatePath(`/products/${editedReview.product.slug}`);

    return { success: 'reviewUpdated' };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return { error: 'validationError' };
  }
};
