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
          priceAtOrder: true,
          quantity: true,
          total: true,
          shippingName: true,
          shippingLastName: true,
          shippingCity: true,
          shippingCountry: true,
          shippingPostalCode: true,
          shippingStreet: true,
        },
      },
    },
  });
};
