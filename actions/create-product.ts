'use server';

import prisma from '@/lib/db';
import { auth } from '../auth';
import { getStoreId } from '../data/store';
import { z } from 'zod';
import { productSchema } from '../schemas';
import DOMPurify from 'isomorphic-dompurify';

export const createProduct = async (data: z.infer<typeof productSchema>) => {
  const session = await auth();

  console.log(data);

  if (!session) return;

  const validateData = productSchema.safeParse(data);
  if (!validateData.success) return { error: 'Kluda!' };

  const { name, description, price, category, quantity, isActive } =
    validateData.data;

  const sanitizedDescription = DOMPurify.sanitize(description, {
    ALLOWED_TAGS: [
      'p',
      'b',
      'i',
      'em',
      'strong',
      'ul',
      'ol',
      'li',
      'br',
      'h2',
      'h3',
    ],
  });

  try {
    const store = await getStoreId();
    // const {name, description}
    // await prisma.product.create({
    //   data: {
    //     name: data.name,
    //   },
    // });
    return { success: 'yey' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};
