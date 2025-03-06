import prisma from '@/lib/db';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
  }
};

export const getUserRole = async (id: string | undefined) => {
  try {
    return await prisma.user.findFirst({
      where: { id },
      select: {
        role: true,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
  }
};
