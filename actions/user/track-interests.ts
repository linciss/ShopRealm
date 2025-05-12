'use server';

import prisma from '@/lib/db';
import { auth } from '../../auth';

export const trackInterest = async (productId: string) => {
  const session = await auth();

  if (!session?.user?.id) return;

  try {
    const userId = session.user.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        category: true,
      },
    });

    if (!product || !product.category.length) return;

    const userInterest = await prisma.userInterest.findUnique({
      where: { userId },
    });

    let interests: Record<string, number> = {};

    if (userInterest?.interests) {
      interests = userInterest.interests as Record<string, number>;
    }

    product.category.forEach((category) => {
      interests[category] = (interests[category] || 0) + 1;
    });

    await prisma.userInterest.upsert({
      where: { userId },
      update: { interests },
      create: {
        userId,
        interests,
      },
    });

    console.log('tracking');

    return { success: true };
  } catch (err) {
    if (err instanceof Error) {
      console.error('error:', err);
    }
    return;
  }
};
