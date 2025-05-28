import prisma from '@/lib/db';
import { auth } from '../../auth';

export const getOrderBySessionId = async (sessionId: string) => {
  const session = await auth();

  if (!session?.user.id) return;

  return prisma.order.findFirst({
    where: {
      stripeSessionId: sessionId,
      userId: session.user.id,
    },
    select: {
      id: true,
      confirmationSent: true,
      orderItems: {
        select: {
          product: true,
        },
      },
    },
  });
};
