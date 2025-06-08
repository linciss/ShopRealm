'use server';
import { nanoid } from 'nanoid';
import prisma from '@/lib/db';
import { auth } from '../../auth';
import { getStoreId } from '../../data/store';
import { z } from 'zod';
import { productSchema } from '../../schemas';
import DOMPurify from 'isomorphic-dompurify';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/utils';
import { optimizedImage } from '@/lib/imageUtils';

export const createProduct = async (data: z.infer<typeof productSchema>) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  const validateData = productSchema.safeParse(data);

  if (!validateData.success) return { error: 'validationError' };

  const {
    name,
    description,
    price,
    category,
    quantity,
    isActive,
    image,
    details,
    specifications,
    sale,
    salePrice,
  } = validateData.data;

  if (price < 1) return { error: 'priceError' };

  const sanitizedDetails = DOMPurify.sanitize(details, {
    ALLOWED_TAGS: [
      'p',
      'b',
      'i',
      'em',
      'strong',
      'ul',
      'u',
      'ol',
      'li',
      'br',
      'h2',
      'h3',
    ],
  });

  const checkIfActive = quantity > 0 && isActive;

  // will see if implement imgur
  // const formData = new FormData();
  // formData.append('image', image);

  // const uploadImage = await fetch('https://api.imgur.com/3/image', {
  //   method: 'POST',
  //   headers: { Authorization: `Client-ID ${process.env.CLIENT_ID}` },
  //   body: {
  //     image,
  //   },
  // });

  try {
    const storeId = (await getStoreId()) as string;

    if (!storeId) return { error: 'storeError' };

    const UUID = nanoid(6);
    const itemSlug = `${slugify(name).toLowerCase()}-${UUID}`;
    const priceDecimals = price.toFixed(2);
    const salePriceDecimals = salePrice?.toFixed(2);
    const optimizedBuffer = await optimizedImage(image);

    if (
      (sale && salePrice !== undefined && salePrice >= price) ||
      (sale && salePrice !== undefined && salePrice < 1)
    ) {
      return { error: 'salePriceError' };
    }

    const stringifiedSpec = JSON.stringify(specifications);

    await prisma.product.create({
      data: {
        name,
        description,
        price: priceDecimals,
        quantity,
        category,
        isActive: checkIfActive,
        storeId,
        slug: itemSlug,
        image: optimizedBuffer as string,
        details: sanitizedDetails,
        specifications: stringifiedSpec,
        sale,
        salePrice: salePriceDecimals,
      },
    });
    revalidatePath('/products');
    revalidatePath('/store/products');
    revalidatePath(`/product/${itemSlug}`);
    revalidatePath('/');

    return { success: 'created' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};
