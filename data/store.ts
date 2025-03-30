import { redirect } from 'next/navigation';
import { auth } from '../auth';
import prisma from '@/lib/db';

// checks if user has a store
export const checkHasStore = async (withRedirect: boolean = true) => {
  const session = await auth();

  if (!session?.user.id) return;

  let hasStore: boolean = false;
  try {
    const storeData = await prisma?.user.findUnique({
      where: { id: session?.user.id, hasStore: true },
    });

    if (!storeData) return;

    hasStore = storeData?.hasStore ?? false;
  } catch (err) {
    console.log('Error: ', err);
  }

  if (withRedirect) {
    if (!hasStore) return redirect('/create-store');
    if (hasStore) return redirect('/store/edit');
    return;
  }

  return hasStore;
};

// gets store name
export const getStoreName = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  const userId = session?.user.id;

  try {
    const storeData = await prisma?.store.findUnique({
      where: { userId },
    });

    if (!storeData) return;

    return storeData?.name as string;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

// gets store data
export const getStoreData = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  const userId = session?.user.id;

  try {
    const storeData = await prisma?.store.findUnique({
      where: { userId },
    });

    if (!storeData) return;

    return storeData;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};

// gets store id
export const getStoreId = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  const userId = session?.user.id;

  try {
    const storeData = await prisma?.store.findUnique({
      where: { userId },
    });

    if (!storeData) return;

    return storeData?.id;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

// gets all products for the store
export const getProducts = async () => {
  const session = await auth();
  if (!session?.user.id) return;

  const userId = session?.user.id;

  try {
    const storeData = await prisma?.store.findUnique({
      where: { userId },
      select: {
        products: {
          select: {
            id: true,
            name: true,
            isActive: true,
            image: true,
            price: true,
            quantity: true,
            slug: true,
          },
        },
      },
    });

    if (!storeData) return;

    return storeData?.products;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

// checks if store has the selected product and retursn the product for store preview
export const getFullStoreProductData = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const userId = session.user.id;

    const isStoreProduct = await prisma?.store.findUnique({
      where: { userId },
      select: {
        products: {
          where: {
            id: productId,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            quantity: true,
            isActive: true,
            image: true,
            slug: true,
            storeId: true,
            category: true,
            createdAt: true,
            updatedAt: true,
            reviews: {
              select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            details: true,
            specifications: true,
          },
        },
      },
    });

    if (!isStoreProduct) return;

    return isStoreProduct.products[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

// gets just product data for correspodnign productid
export const getStoreProductData = async (productId: string) => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const userId = session.user.id;

    const isStoreProduct = await prisma?.store.findUnique({
      where: { userId },
      select: {
        products: {
          where: {
            id: productId,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            quantity: true,
            isActive: true,
            image: true,
            category: true,
            details: true,
            specifications: true,
          },
        },
      },
    });

    if (!isStoreProduct) return;

    return isStoreProduct.products[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};
