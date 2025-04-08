import prisma from '@/lib/db';
import { auth } from '../auth';
import { getStoreId } from './store';

export const getOrders = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const storeId = await getStoreId();

    const order = await prisma.orderItem.findMany({
      where: { storeId },
      select: {
        id: true,
        order: {
          select: {
            createdAt: true,
          },
        },
        status: true,
        quantity: true,
        priceAtOrder: true,
        total: true,
      },
    });

    return order;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};

export const getOrderItemById = async (orderId: string) => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const storeId = await getStoreId();

    const order = await prisma.orderItem.findFirst({
      where: { id: orderId, storeId },
      select: {
        id: true,
        product: {
          select: {
            name: true,
            image: true,
          },
        },
        order: {
          select: {
            paymentStatus: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
                address: {
                  select: {
                    city: true,
                    country: true,
                    street: true,
                    postalCode: true,
                  },
                },
              },
            },
          },
        },
        status: true,
        quantity: true,
        priceAtOrder: true,
        total: true,
      },
    });

    return order;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};

export const getOrderHsitory = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const orderItems = await prisma.order.findMany({
      where: { userId: session.user.id },
      select: {
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            store: {
              select: {
                name: true,
                user: {
                  select: {
                    email: true,
                  },
                },
                storePhone: true,
              },
            },
            product: {
              select: {
                name: true,
                image: true,
                id: true,
              },
            },
            priceAtOrder: true,
            status: true,
            quantity: true,
            total: true,
          },
        },
      },
    });

    return orderItems;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};
