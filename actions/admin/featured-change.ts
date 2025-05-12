'use server';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth } from '../../auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const featureChange = async (productId: string) => {
  const session = await auth();

  if (!session?.user?.admin) return { error: 'authError' };

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { featured: true },
    });

    if (!product) return { error: 'prodNotFound' };

    const newStatus = !product.featured;

    await prisma.product.update({
      where: { id: productId },
      data: {
        featured: newStatus,
      },
    });

    revalidatePath('/admin/products');
    return { success: 'featuredChanged' };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2025') return { error: 'prodNotFound' };
      return { error: 'validationError' };
    }
    return { error: 'validationError' };
  }
};
