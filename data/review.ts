import prisma from '@/lib/db';
import { auth } from '../auth';

export const getUserReview = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const userId = session.user.id;

    const userHasReview = await prisma.review.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (!userHasReview) return;

    return userHasReview.id;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};
