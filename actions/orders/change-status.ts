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

  if (!session?.user.id) return { error: 'Lietotjas nav autorizets!' };

  const validStatuses = ['pending', 'shipped', 'complete', 'returned'];
  if (!validStatuses.includes(status)) {
    return { error: 'Nav pareizs statuss' };
  }

  try {
    const storeId = await getStoreId();

    const existingOrderItem = await prisma.orderItem.findFirst({
      where: { id: orderItemId, storeId },
    });

    if (existingOrderItem?.status === 'complete' && status !== 'returned') {
      return { error: 'Pabeigtus pasutijumus nevar mainit!' };
    }

    if (existingOrderItem?.status === 'returned') {
      return { error: 'Pasutijums jau ir atgriezts!' };
    }

    const complete = status === 'complete';
    const transferScheduleDate = new Date();
    transferScheduleDate.setDate(transferScheduleDate.getDate() + 14);

    await prisma.orderItem.update({
      where: { id: orderItemId, storeId },
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
    return { success: 'Nomaits statuss!' };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    } else if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2025') return { error: 'Nav atrasts pasutijums!' };
      return { error: 'Kļūda apstrādājot datus' };
    }
    return { error: ' Kluda validejot datus!' };
  }
};
