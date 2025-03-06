import { redirect } from 'next/navigation';
import { auth } from '../auth';
import prisma from '@/lib/db';
import { createStoreRoute } from '../routes';

export const checkStore = async () => {
  const session = await auth();

  const hasStore = await prisma.user.findFirst({
    where: { id: session?.user.id, hasStore: true },
  });

  if (!hasStore) return redirect(createStoreRoute);

  return redirect('/store');
};
