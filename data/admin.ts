import prisma from '@/lib/db';
import { auth } from '../auth';

interface QueryOptions {
  page: number;
  search?: string;
}

export const getDashboardData = async () => {
  const session = await auth();

  if (!session?.user.admin) return;

  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalProducts = await prisma.product.count({
      where: {
        deleted: false,
      },
    });

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

  if (!session?.user.admin) return;

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
        deleted: false,
      },
    });

    const paginatedStores = await prisma.store.findMany({
      where: {
        approved: true,
        ...searchCondition,
        deleted: false,
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
        deleted: false,
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

  if (!session?.user.admin) return;

  try {
    const store = await prisma.store.findUnique({
      where: {
        id: id,
        deleted: false,
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

  if (!session?.user.admin) return;

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

    const totalUsers = await prisma.user.count({
      where: { ...userConditions, id: { not: '6835d5809150feb71e83d922' } },
    });

    const paginatedUsers = await prisma.user.findMany({
      where: {
        ...userConditions,
        id: { not: '6835d5809150feb71e83d922' },
        deleted: false,
      },
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
      where: { ...adminConditions, deleted: false },
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

  if (!session?.user.admin) return;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
        deleted: false,
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

  if (!session?.user.admin) return;

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
        store: product?.store?.name,
        stock: product.quantity,
        price: product.price,
        createdAt: product.createdAt,
        image: product.image,
        active: product.isActive,
        sale: product.sale,
        salePrice: product.salePrice,
        featured: product.featured,
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

export const getPendingStores = async () => {
  const session = await auth();

  if (!session?.user.admin) return;

  try {
    const pendingStores = await prisma.store.findMany({
      where: {
        approved: false,
        deleted: false,
      },
      include: {
        user: {
          select: { name: true, lastName: true, email: true },
        },
        products: {
          where: { deleted: false },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return pendingStores.map((store) => ({
      id: store.id,
      name: store.name,
      owner: store.user.name + ' ' + store.user.lastName,
      email: store.user.email,
      products: store.products.length,
      active: store.active,
      createdAt: store.createdAt,
    }));
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getOrders = async ({ page, search }: QueryOptions) => {
  const session = await auth();

  if (!session?.user.admin) return;

  try {
    const searchCondition = search
      ? {
          OR: [
            { id: { contains: search, mode: 'insensitive' as const } },
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
          ],
        }
      : {};

    const paginatedOrders = await prisma.orderItem.findMany({
      where: {
        ...searchCondition,
        order: {
          user: {
            deleted: false,
          },
        },
        store: {
          deleted: false,
        },
      },

      include: {
        order: {
          select: {
            user: {
              select: {
                name: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
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

    const totalOrders = await prisma.order.count();

    const ordersToReview = await prisma.orderItem.findMany({
      where: {
        order: {
          user: {
            deleted: true,
          },
        },
        store: {
          deleted: true,
        },
      },
      include: {
        order: {
          select: {
            user: {
              select: {
                name: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        store: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      orders: paginatedOrders.map((order) => ({
        id: order.id,
        user: order.order.user.name + ' ' + order.order.user.lastName,
        storeId: order.storeId,
        storeName: order?.store?.name,
        email: order.order.user.email,
        status: order.status,
        totalPrice: order.total,
        createdAt: order.createdAt,
        escrowStatus: order.escrowStatus,
      })),
      totalOrders,
      ordersToReview: ordersToReview.map((order) => ({
        id: order.id,
        user: order.shippingName + ' ' + order.shippingLastName,
        storeId: order.storeId,
        storeName: order?.store?.name,
        email: order.order.user.email,
        status: order.status,
        totalPrice: order.total,
        createdAt: order.createdAt,
        escrowStatus: order.escrowStatus,
      })),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error:', error.stack);
    }
    return;
  }
};

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session?.user.admin) return;

  try {
    const order = await prisma.orderItem.findFirst({
      where: { id },
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
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error:', error.stack);
    }
    return;
  }
};
