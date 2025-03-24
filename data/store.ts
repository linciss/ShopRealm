import { redirect } from 'next/navigation';
import { auth } from '../auth';
import prisma from '@/lib/db';

export const checkHasStore = async (withRedirect: boolean = true) => {
  const session = await auth();

  if (!session?.user) return { error: 'Erorr' };

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

export const getStoreName = async () => {
  const session = await auth();

  if (!session?.user) return;

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

export const getStoreSlug = async () => {
  const session = await auth();

  if (!session?.user) return;

  const userId = session?.user.id;

  try {
    const storeData = await prisma?.store.findUnique({
      where: { userId },
    });

    if (!storeData) return;

    return storeData?.slug as string;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};

export const getStoreData = async () => {
  const session = await auth();

  if (!session?.user) return;

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

export const getStoreId = async () => {
  const session = await auth();

  if (!session?.user) return;

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
    return { error: 'Kļūda apstrādājot datus' };
  }
};

export const getProducts = async () => {
  const session = await auth();
  if (!session?.user) return;

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
