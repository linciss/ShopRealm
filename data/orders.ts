import prisma from '@/lib/db';
import { auth } from '../auth';
import { getStoreId } from './store';

interface OrderFilterProps {
  status?: string;
  dateRange?: string;
  sort?: string;
}

export const getOrders = async ({
  status,
  dateRange,
  sort,
}: OrderFilterProps) => {
  const storeId = await getStoreId();

  const allOrders = await prisma.orderItem.findMany({
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

  let filteredOrders = [...allOrders];

  if (status) {
    switch (status) {
      case 'pending':
        filteredOrders = filteredOrders.filter(
          (order) => order.status === 'pending',
        );
        break;
      case 'shipped':
        filteredOrders = filteredOrders.filter(
          (order) => order.status === 'shipped',
        );
        break;
      case 'complete':
        filteredOrders = filteredOrders.filter(
          (order) => order.status === 'complete',
        );
        break;
      case 'returned':
        filteredOrders = filteredOrders.filter(
          (order) => order.status === 'returned',
        );
        break;
      default:
        break;
    }
  }

  if (dateRange) {
    switch (dateRange) {
      case 'today':
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.order.createdAt);
          const today = new Date();
          return (
            orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear()
          );
        });
        break;
      case 'last-7-days':
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.order.createdAt);
          const today = new Date();
          const last7Days = new Date(today.setDate(today.getDate() - 7));
          return orderDate >= last7Days;
        });
        break;
      case 'last-30-days':
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.order.createdAt);
          const today = new Date();
          const last30Days = new Date(today.setDate(today.getDate() - 30));
          return orderDate >= last30Days;
        });
        break;
      case 'thisYear':
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.order.createdAt);
          const today = new Date();
          return orderDate.getFullYear() === today.getFullYear();
        });
      default:
        break;
    }
  }

  if (sort) {
    switch (sort) {
      case 'newest':
        filteredOrders.sort(
          (a, b) =>
            new Date(b.order.createdAt).valueOf() -
            new Date(a.order.createdAt).valueOf(),
        );
        break;
      case 'oldest':
        filteredOrders.sort(
          (a, b) =>
            new Date(a.order.createdAt).valueOf() -
            new Date(b.order.createdAt).valueOf(),
        );
        break;
      case 'highest-value':
        filteredOrders.sort((a, b) => b.total - a.total);
        break;
      case 'lowest-value':
        filteredOrders.sort((a, b) => a.total - b.total);
        break;
      default:
        break;
    }
  }

  return {
    filteredOrders,
    allOrders,
  };
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
          },
        },
        status: true,
        quantity: true,
        priceAtOrder: true,
        total: true,
        shippingName: true,
        shippingLastName: true,
        shippingEmail: true,
        shippingPhone: true,
        shippingStreet: true,
        shippingCity: true,
        shippingCountry: true,
        shippingPostalCode: true,
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
