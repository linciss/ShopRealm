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

export const generateResetPasswordToken = async (email: string) => {
  await prisma.passwordResetToken.deleteMany({
    where: {
      email: email,
    },
  });

  const token = uuidv4();
  const expires = new Date(Date.now() + 900 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      email,
      expires,
      token,
    },
  });

  return token;
};

export const verifyResetPasswordToken = async (token: string) => {
  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!passwordResetToken) return null;

  if (new Date() > passwordResetToken.expires) {
    await prisma.passwordResetToken.deleteMany({
      where: { id: passwordResetToken.id },
    });
    return null;
  } else if (passwordResetToken.used) {
    await prisma.passwordResetToken.deleteMany({
      where: { id: passwordResetToken.id },
    });
    return null;
  }

  return passwordResetToken;
};
