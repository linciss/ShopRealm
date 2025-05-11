import prisma from '@/lib/db';
import { auth } from '../auth';

export const getDashboardData = async () => {
  const session = await auth();

  if (!session?.user.id) return;
  if (!session.user.admin) return;

  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalProducts = await prisma.product.count();

    return {
      totalUsers,
      totalStores,
      totalProducts,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getStores = async (page: number) => {
  const session = await auth();

  if (!session?.user.id) return;
  if (!session.user.admin) return;

  const skip = page ? (page - 1) * 10 : 0;

  try {
    const stores = await prisma.store.findMany({
      include: {
        products: true,
        user: {
          select: {
            name: true,
            lastName: true,
            email: true,
          },
        },
      },
      skip: skip,
      take: 10,
    });

    return {
      stores: stores.map((store) => ({
        id: store.id,
        name: store.name,
        owner: store.user.name + ' ' + store.user.lastName,
        email: store.user.email,
        products: store.products.length,
        active: store.active,
        createdAt: store.createdAt,
      })),
      totalStores: await prisma.store.count(),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getStoreDataById = async (id: string) => {
  const session = await auth();

  if (!session?.user.id) return;
  if (!session.user.admin) return;

  try {
    const store = await prisma.store.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
        id: true,
        description: true,
        active: true,
        storePhone: true,
      },
    });

    return store;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};
