'use server';

import prisma from '@/lib/db';
import { auth } from '../../../../auth';
import { createStoreRoute } from '../../../../routes';
import { redirect } from 'next/navigation';

export default async function Store() {
  const session = await auth();

  const storeData = await prisma.store.findFirst({
    where: { userId: session?.user.id },
  });

  if (!storeData) return redirect(createStoreRoute);

  return (
    <div className='py-10'>
      <h1 className='text-2xl font-bold'>Mans veikkals</h1>
    </div>
  );
}
