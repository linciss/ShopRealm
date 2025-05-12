'use server';

import prisma from '@/lib/db';
import { auth } from '../../auth';
import { getStoreId } from '../../data/store';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { revalidatePath } from 'next/cache';

type Status = 'pending' | 'shipped' | 'complete' | 'returned';

export const changeOrderStatus = async (
  orderItemId: string,
  status: Status,
) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  const validStatuses = ['pending', 'shipped', 'complete', 'returned'];
  if (!validStatuses.includes(status)) {
    return { error: 'wrongStatus' };
  }

  try {
    const storeId = await getStoreId();

    const existingOrderItem = await prisma.orderItem.findFirst({
      where: { id: orderItemId },
    });

    if (
      !existingOrderItem ||
      (existingOrderItem.storeId !== storeId && !session.user.admin)
    ) {
      return { error: 'orderNotFound' };
    }

    if (
      existingOrderItem?.status === 'complete' &&
      status !== 'returned' &&
      !session.user.admin
    ) {
      return { error: 'completedCantBeChanged' };
    }

    if (existingOrderItem?.status === 'returned') {
      return { error: 'orderReturned' };
    }

    const complete = status === 'complete';
    const transferScheduleDate = new Date();
    transferScheduleDate.setDate(transferScheduleDate.getDate() + 14);

    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        status: status,
        ...(complete
          ? {
              transferScheduledFor: transferScheduleDate,
            }
          : {}),
      },
    });

    revalidatePath(`/store/orders/${orderItemId}`);
    return { success: 'statusChanged' };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    } else if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2025') return { error: 'orderNotFound' };
      return { error: 'validationError' };
    }
    return { error: 'validationError' };
  }
};
