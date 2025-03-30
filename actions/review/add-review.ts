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

  if (!session?.user.id) return { error: 'Liettoajs nav autorizets!' };

  const validateData = reviewSchema.safeParse(data);

  if (!validateData.success) return { error: 'Kluda ar datiem!' };

  const { rating, comment } = validateData.data;

  try {
    const userId = session.user.id;

    // rn commented bcs i hjavent implemented order yet!
    // finds if product has been bought by user since we restrict users from reviewing if they haventy bought item
    // const hasBoughtProduct = await prisma.order.findFirst({
    //   where: {
    //     userId,
    //     orderItems: {
    //       some: { productId },
    //     },
    //   },
    // });

    // if (!hasBoughtProduct) return { error: 'Nav nopirkts produkts!' };

    // checks if user has already reviewed a product
    const review = await prisma.review.findFirst({
      where: { userId, productId },
    });

    if (review) return { error: 'Atsauksme jau pastav!' };

    // creates the review
    await prisma.review.create({
      data: {
        productId,
        comment,
        rating,
        userId,
      },
    });

    revalidatePath(`/products/${productId}`);

    return { success: 'Atsaukme pievienota!' };
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error: ', err.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};
