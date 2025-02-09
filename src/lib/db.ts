// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
  console.log('Prisma Client initialized in production mode');
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    console.log('Prisma Client initialized in development mode');
  }
  prisma = global.prisma;
}

export default prisma;
