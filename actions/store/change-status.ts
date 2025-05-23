'use server';
import prisma from '@/lib/db';
import { auth } from '../../auth';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const changeStatus = async (active: boolean, id?: string) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  if (typeof active !== 'boolean') {
    return { error: 'validationError' };
  }

  try {
    if (id && session.user.admin) {
      await prisma.store.update({
        where: { id },
        data: {
          active,
        },
      });
      return { success: 'changedStatus' };
    }

    await prisma.store.update({
      where: { userId: session.user.id },
      data: {
        active,
      },
    });

    return { success: 'changedStatus' };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'storeNotFound' };
      console.log(error);
      return { error: 'validationError' };
    } else {
      console.log(error);
      return { error: 'validationError' };
    }
  }
};
