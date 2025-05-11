import prisma from '@/lib/db';
import { auth } from '../auth';

interface QueryOptions {
  page: number;
  search?: string;
}

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

export const getStores = async ({ page, search }: QueryOptions) => {
  const session = await auth();

  if (!session?.user.id) return;
  if (!session.user.admin) return;

  try {
    const searchCondition = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            {
              user: {
                name: { contains: search, mode: 'insensitive' as const },
              },
            },
            {
              user: {
                lastName: { contains: search, mode: 'insensitive' as const },
              },
            },
            {
              user: {
                email: { contains: search, mode: 'insensitive' as const },
              },
            },
          ],
        }
      : {};

    const totalStores = await prisma.store.count({
      where: {
        approved: true,
        ...searchCondition,
      },
    });

    const paginatedStores = await prisma.store.findMany({
      where: {
        approved: true,
        ...searchCondition,
      },
      include: {
        products: {
          where: { deleted: false },
          select: { id: true },
        },
        user: {
          select: { name: true, lastName: true, email: true },
        },
      },
      skip: (page - 1) * 10,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const pendingStores = await prisma.store.findMany({
      where: {
        approved: false,
        ...searchCondition,
      },
      include: {
        products: {
          where: { deleted: false },
          select: { id: true },
        },
        user: {
          select: { name: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      stores: paginatedStores.map((store) => ({
        id: store.id,
        name: store.name,
        owner: store.user.name + ' ' + store.user.lastName,
        email: store.user.email,
        products: store.products.length,
        active: store.active,
        createdAt: store.createdAt,
      })),
      totalStores,
      pendingStores: pendingStores.map((store) => ({
        id: store.id,
        name: store.name,
        owner: store.user.name + ' ' + store.user.lastName,
        email: store.user.email,
        products: store.products.length,
        active: store.active,
        createdAt: store.createdAt,
      })),
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

export const getUserData = async ({ page, search }: QueryOptions) => {
  const session = await auth();

  if (!session?.user.id) return;
  if (!session.user.admin) return;

  try {
    const searchCondition = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const userConditions = {
      adminPrivileges: false,
      ...searchCondition,
    };

    const totalUsers = await prisma.user.count({ where: userConditions });

    const paginatedUsers = await prisma.user.findMany({
      where: userConditions,
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
        hasStore: true,
        createdAt: true,
        emailVerified: true,
        store: {
          select: { id: true },
        },
      },
      skip: (page - 1) * 10,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const adminConditions = {
      adminPrivileges: true,
      ...searchCondition,
    };

    const admins = await prisma.user.findMany({
      where: adminConditions,
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
        hasStore: true,
        createdAt: true,
        store: {
          select: { id: true },
        },
        adminPrivileges: true,
        adminLevel: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      users: paginatedUsers.map((user) => ({
        id: user.id,
        name: user.name + ' ' + user.lastName,
        email: user.email,
        role: user.role,
        verified: user.emailVerified,
        createdAt: user.createdAt,
        hasStore: user.hasStore,
        storeId: user.store ? user.store.id : null,
      })),
      totalUsers,
      admins: admins.map((user) => ({
        id: user.id,
        name: user.name + ' ' + user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        hasStore: user.hasStore,
        adminLevel: user.adminLevel,
        storeId: user.store ? user.store.id : null,
        adminPrivileges: user.adminPrivileges,
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getUserDataById = async (id: string) => {
  const session = await auth();

  if (!session?.user.id) return;
  if (!session.user.admin) return;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        adminPrivileges: true,
        adminLevel: true,
        phone: true,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getProducts = async ({ page, search }: QueryOptions) => {
  const session = await auth();

  if (!session?.user.id) return;
  if (!session.user.admin) return;

  try {
    const searchCondition = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            {
              store: {
                name: { contains: search, mode: 'insensitive' as const },
              },
            },
          ],
        }
      : {};

    const paginatedProducts = await prisma.product.findMany({
      where: { ...searchCondition, deleted: false },
      include: {
        store: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 10,
      take: 10,
    });

    const totalProducts = await prisma.product.count({
      where: {
        deleted: false,
      },
    });

    return {
      products: paginatedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        store: product.store.name,
        stock: product.quantity,
        price: product.price,
        createdAt: product.createdAt,
        image: product.image,
        active: product.isActive,
        sale: product.sale,
        salePrice: product.salePrice,
      })),
      totalProducts,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getProductById = async (id: string) => {
  const session = await auth();

  if (!session?.user.id) return;
  if (!session.user.admin) return;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });

    return product;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};
