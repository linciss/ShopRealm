'use server';

import prisma from '@/lib/db';
import { getUserRole } from '../data/user';

export const switchRole = async (id: string | undefined) => {
  const userRole = await getUserRole(id);

  if (!userRole) return { error: 'Kluda' };

  const { role } = userRole;

  if (role === 'SHOPPER') {
    return await prisma.user.update({ where: { id }, data: { role: 'STORE' } });
  }

  return await prisma.user.update({ where: { id }, data: { role: 'SHOPPER' } });
};
