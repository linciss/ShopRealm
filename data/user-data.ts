import prisma from '@/lib/db';
import { auth } from '../auth';

export const getUserData = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        name: true,
        lastName: true,
        UUID: true,
        phone: true,
        createdAt: true,
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

  if (!session?.user.id) return;

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

export const getUserShippingInfo = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        emailVerified: true,
        lastName: true,
        phone: true,
        email: true,
        address: {
          select: {
            country: true,
            city: true,
            street: true,
            postalCode: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
  }
};

export const getUserEmailStatus = async () => {
  const session = await auth();

  if (!session?.user.id) return;

  try {
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        emailVerified: true,
      },
    });

    return userData;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
  }
};
