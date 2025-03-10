'use server';

import prisma from '@/lib/db';
import { getUserRole } from '../data/user';
import { checkHasStore } from '../data/store';
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
      console.log('UPDATING USER!!!!!');
      await prisma.user.update({ where: { id }, data: { role: 'STORE' } });
      await checkHasStore();
    }

    return await prisma.user.update({
      where: { id },
      data: { role: 'SHOPPER' },
    });
  } catch (err) {
    console.log(err);
    return { error: 'Kļūda apstrādājot datus' };
  }
};
