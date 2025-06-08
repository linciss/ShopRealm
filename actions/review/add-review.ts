'use server';

import { z } from 'zod';
import { auth } from '../../auth';
import { reviewSchema } from '../../schemas';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const addReview = async (
  data: z.infer<typeof reviewSchema>,
  productId: string,
) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  const validateData = reviewSchema.safeParse(data);

  if (!validateData.success) return { error: 'validationError' };

  const { rating, comment } = validateData.data;

  try {
    const userId = session.user.id;

    // finds if product has been bought by user since we restrict users from reviewing if they haventy bought item
    const hasBoughtProduct = await prisma.order.findFirst({
      where: {
        userId,
        orderItems: {
          some: { productId },
        },
      },
    });

    if (!hasBoughtProduct) return { error: 'notBought' };

    // checks if user has already reviewed a product
    const review = await prisma.review.findFirst({
      where: { userId, productId },
    });

    if (review) return { error: 'reviewActive' };

    // creates the review
    await prisma.review.create({
      data: {
        productId,
        comment,
        rating,
        userId,
      },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });
    revalidatePath(`/products/${product?.slug}`);

    return { success: 'reviewSubmitted' };
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error: ', err.stack);
    }
    return { error: 'validationError' };
  }
};
