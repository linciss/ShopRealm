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

    let filteredStores = [...stores.filter((store) => store.approved === true)];
    const pendingStores = [
      ...stores.filter((store) => store.approved === false),
    ];

    if (search) {
      const searchLower = search.toLowerCase();

      filteredStores = filteredStores.filter(
        (store) =>
          store.name.toLowerCase().includes(searchLower) ||
          store.user.name.toLowerCase().includes(searchLower) ||
          store.user.lastName.toLowerCase().includes(searchLower) ||
          store.user.email.toLowerCase().includes(searchLower) ||
          (
            store.user.name.toLowerCase() +
            ' ' +
            store.user.lastName.toLowerCase()
          ).includes(searchLower),
      );
    }

    const totalStores = filteredStores.length;
    const startIndex = (page - 1) * 10;
    const paginatedStores = filteredStores.slice(startIndex, startIndex + 10);
    const totalPendingStores = pendingStores.length;

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
      totalStores: totalStores,
      pendingStores: pendingStores.map((store) => ({
        id: store.id,
        name: store.name,
        owner: store.user.name + ' ' + store.user.lastName,
        email: store.user.email,
        products: store.products.length,
        active: store.active,
        createdAt: store.createdAt,
      })),
      totalPendingStores,
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
    const users = await prisma.user.findMany({
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
          select: {
            id: true,
          },
        },
        adminPrivileges: true,
        adminLevel: true,
      },
    });

    const admins = users.filter((user) => user.adminPrivileges === true);
    let filteredUsers = [
      ...users.filter((user) => user.adminPrivileges !== true),
    ];

    if (search) {
      const searchLower = search.toLowerCase();

      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          (
            user.name.toLowerCase() +
            ' ' +
            user.lastName.toLowerCase()
          ).includes(searchLower),
      );
    }

    const totalUsers = filteredUsers.length;
    const startIndex = (page - 1) * 10;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + 10);

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
