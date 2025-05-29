'use server';

import { z } from 'zod';
import { auth } from '../../auth';
import { userCreateSchema, userEditSchema } from '../../schemas';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getUserByEmail } from '../../data/user';

export const createUser = async (data: z.infer<typeof userCreateSchema>) => {
  const session = await auth();

  if (!session?.user.admin) return { error: 'authError' };
  if (session.user.adminLevel !== 'SUPER_ADMIN') return { error: 'authError' };

  const validateData = userCreateSchema.safeParse(data);

  if (!validateData.success) {
    return { error: 'validationError' };
  }

  const {
    email,
    password,
    passwordConfirm,
    name,
    lastName,
    adminLevel,
    adminPrivileges,
  } = validateData.data;

  if (password !== passwordConfirm) {
    return { error: 'doNotMatch' };
  }

  if (
    adminPrivileges &&
    adminLevel !== 'ADMIN' &&
    adminLevel !== 'SUPER_ADMIN'
  ) {
    return { error: 'wrongAdminLevel' };
  }

  const emailToLower = email.toLowerCase();

  try {
    // cehck  if user already exists
    const existingUser = await getUserByEmail(emailToLower);
    if (existingUser) {
      return { error: 'userAlreadyExists' };
    }

    const existingPhone = await prisma.user.findFirst({
      where: { phone: validateData.data.phone },
    });

    if (existingPhone) {
      return { error: 'phoneExists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    await prisma.user.create({
      data: {
        email: emailToLower,
        password: hashedPassword,
        name,
        lastName,
        adminLevel,
        adminPrivileges,
        address: {
          create: {
            street: '',
            city: '',
            country: '',
            postalCode: '',
          },
        },
      },
      include: {
        address: true,
      },
    });

    return { success: 'userCreated' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'validationError' };
  }
};

export const editUser = async (
  data: z.infer<typeof userEditSchema>,
  id: string,
) => {
  const session = await auth();

  if (!session?.user.admin) return { error: 'authError' };

  const validateData = userEditSchema.safeParse(data);

  if (!validateData.success) {
    return { error: 'validationError' };
  }

  const {
    password,
    passwordConfirm,
    name,
    lastName,
    adminLevel,
    adminPrivileges,
  } = validateData.data;

  let hashedPassword = '';
  if (password && passwordConfirm) {
    if (password !== passwordConfirm) {
      return { error: 'doNotMatch' };
    }
    hashedPassword = await bcrypt.hash(password, 10);
  }

  if (
    adminPrivileges &&
    adminLevel !== 'ADMIN' &&
    adminLevel !== 'SUPER_ADMIN'
  ) {
    return { error: 'wrongAdminLevel' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    const existingPhone = await prisma.user.findFirst({
      where: { phone: validateData.data.phone, id: { not: id } },
    });

    if (existingPhone) {
      return { error: 'phoneExists' };
    }

    if (existingUser?.adminPrivileges && !adminPrivileges) {
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          lastName,
          adminLevel: {
            set: null,
          },
          adminPrivileges,
          ...(hashedPassword && { password: hashedPassword }),
        },
      });

      return { success: 'userEdited' };
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        lastName,
        adminLevel,
        adminPrivileges,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    return { success: 'userEdited' };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return { error: 'userNotFound' };
      return { error: 'validationError' };
    }
    return { error: 'validationError' };
  }
};
