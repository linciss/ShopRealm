'use server';

import prisma from '@/lib/db';
import { auth, signOut } from '../../auth';
import { Role } from '@prisma/client';

export const switchRole = async () => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  let newRole: Role;

  try {
    const id = session?.user?.id;
    const store = await prisma.store.findFirst({
      where: {
        userId: id,
      },
    });
    if (!store) return { error: 'noStoreFound' };

    const role = session?.user?.role;

    newRole = role === 'SHOPPER' ? 'STORE' : 'SHOPPER';

    if (!role) return { error: 'validationError' };

    if (newRole === 'STORE' && !store?.approved) {
      return { error: 'storeNotApproved' };
    }

    await prisma.user.update({
      where: { id },
      data: { role: newRole },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'validationError' };
  }

  await signOut({
    redirectTo: '/auth/sign-in',
  });
};
