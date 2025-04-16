import { v4 as uuidv4 } from 'uuid';
import prisma from './db';

// generatesgenerates a verirfication token
export const generateToken = async (email: string) => {
  await prisma.verificationToken.deleteMany({
    where: {
      email: email,
    },
  });

  const token = uuidv4();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      email,
      expires,
      token,
    },
  });

  return token;
};

export const verifyToken = async (token: string) => {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) return null;

  if (new Date() > verificationToken.expires) {
    await prisma.verificationToken.deleteMany({
      where: { id: verificationToken.id },
    });
    return null;
  }

  return verificationToken;
};
