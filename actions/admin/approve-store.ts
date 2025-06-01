'use server';

import prisma from '@/lib/db';
import { auth } from '../../auth';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { revalidatePath } from 'next/cache';
import { sendStoreApproval } from '../emailing/email';

export const approveStore = async (id: string, approve: boolean) => {
  const session = await auth();

  if (!session?.user.admin) return { error: 'authError' };

  if (typeof approve !== 'boolean') {
    return { error: 'validationError' };
  }

  if (!id) {
    return { error: 'validationError' };
  }

  try {
    const store = await prisma.store.findUnique({
      where: { id },
    });
    if (!store) {
      return { error: 'storeNotFound' };
    }

    if (store.approved) {
      return { error: 'alreadyApproved' };
    }

    const user = await prisma.user.findUnique({
      where: { id: store.userId as string },
      select: { email: true },
    });

    if (approve) {
      await prisma.store.update({
        where: { id },
        data: {
          active: true,
          approved: true,
        },
      });

      revalidatePath('/admin/stores');
      await sendStoreApproval(true, user?.email as string);
      return { success: 'approved' };
    }

    await prisma.store.delete({
      where: { id },
    });

    await sendStoreApproval(false, user?.email as string);

    await prisma.user.update({
      where: { id: store.userId as string },
      data: {
        hasStore: false,
      },
    });

    revalidatePath('/admin/stores');

    return { success1: 'disapproved' };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'userNotFound' };
      return { error: 'validationError' };
    }
    return { error: 'validationError' };
  }
};
