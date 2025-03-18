import { redirect } from 'next/navigation';
import { auth } from '../auth';
import prisma from '@/lib/db';

export const checkHasStore = async (withRedirect: boolean = true) => {
  const session = await auth();

  if (!session?.user) return { error: 'Erorr' };

  let hasStore: boolean = false;
  try {
    const storeData = await prisma?.user.findFirst({
      where: { id: session?.user.id, hasStore: true },
    });

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
    const storeData = await prisma?.store.findFirst({
      where: { userId },
    });

    return storeData?.name as string;
  } catch (err) {
    console.log('Error: ', err);
  }
};

export const getStoreSlug = async () => {
  const session = await auth();

  if (!session?.user) return;

  const userId = session?.user.id;

  try {
    const storeData = await prisma?.store.findFirst({
      where: { userId },
    });

    return storeData?.slug as string;
  } catch (err) {
    console.log('Error: ', err);
  }
};
