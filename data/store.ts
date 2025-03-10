import { redirect } from 'next/navigation';
import { auth } from '../auth';
import prisma from '@/lib/db';

export const checkHasStore = async (withRedirect: boolean = true) => {
  const session = await auth();
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
    if (!hasStore) return redirect('/store/create');
    return;
  }

  return hasStore;
};
