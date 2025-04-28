'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { changeProfilePasswordSchema } from '../../schemas';
import { auth } from '../../auth';
import bcrypt from 'bcryptjs';

export const changePassword = async (
  data: z.infer<typeof changeProfilePasswordSchema>,
) => {
  const validateData = changeProfilePasswordSchema.safeParse(data);
  const session = await auth();

  if (!session?.user?.id) return { error: 'authError' };

  if (!validateData.success) {
    return { error: 'validationError' };
  }

  try {
    const userId = session?.user?.id;

    const { oldPassword, newPassword, newPasswordConfirm } = validateData.data;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) return { error: 'userNotFound' };

    const matching = await bcrypt.compare(oldPassword, user?.password);

    if (!matching) return { error: 'wrongOldPassword' };

    if (newPassword !== newPasswordConfirm)
      return { error: 'newPasswordDoNotMatch' };

    if (newPassword === oldPassword) return { error: 'oldCantBeNew' };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { success: 'passwordChanged' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'validationError' };
  }
};
