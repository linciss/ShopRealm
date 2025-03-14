'use server';

import prisma from '@/lib/db';
import { getUserRole } from '../data/user';
import { auth } from '../auth';

export const switchRole = async () => {
  const session = await auth();

  if (!session?.user) return { error: 'Kluda!' };

  try {
    const id = session?.user?.id;

    const userRole = await getUserRole(id);

    if (!userRole) return { error: 'Kluda' };

    const { role } = userRole;

    if (role === 'SHOPPER') {
      return await prisma.user.update({
        where: { id },
        data: { role: 'STORE' },
      });
    }

    return await prisma.user.update({
      where: { id },
      data: { role: 'SHOPPER' },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};
