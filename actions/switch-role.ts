'use server';

import prisma from '@/lib/db';
import { auth, signOut } from '../auth';
import { Role } from '@prisma/client';

export const switchRole = async () => {
  const session = await auth();

  if (!session?.user) return { error: 'Kluda!' };

  console.log(session?.user?.role);

  let newRole: Role;

  try {
    const id = session?.user?.id;

    const role = session?.user?.role;

    newRole = role === 'SHOPPER' ? 'STORE' : 'SHOPPER';

    if (!role) return { error: 'Kluda' };

    await prisma.user.update({
      where: { id },
      data: { role: newRole },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }

  await signOut({
    redirectTo: '/auth/sign-in',
  });
};
