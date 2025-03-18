import prisma from '@/lib/db';
import { auth } from '../auth';

export const getUserData = async () => {
  const session = await auth();

  if (!session?.user) return;

  try {
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        name: true,
        lastName: true,
        UUID: true,
        phone: true,
      },
    });

    return userData;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
  }
};

export const getUserAddress = async () => {
  const session = await auth();

  if (!session?.user) return;

  try {
    const userAddress = await prisma.address.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        street: true,
        city: true,
        country: true,
        postalCode: true,
      },
    });
    return userAddress;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
  }
};
