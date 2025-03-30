'use server';
import { nanoid } from 'nanoid';
import prisma from '@/lib/db';
import { auth } from '../../auth';
import { getStoreId } from '../../data/store';
import { z } from 'zod';
import { productSchema } from '../../schemas';
import DOMPurify from 'isomorphic-dompurify';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export const createProduct = async (data: z.infer<typeof productSchema>) => {
  const session = await auth();

  console.log(data);

  if (!session?.user.id) return { error: 'Nav autorizēts lietotājs' };

  const validateData = productSchema.safeParse(data);

  if (!validateData.success) return { error: 'Validācijas kļūda!' };

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
  } = validateData.data;

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

    if (!storeId) return { error: 'Nav veikals atrasts' };

    const UUID = nanoid(6);
    const itemSlug = `${slugify(name).toLowerCase()}-${UUID}`;
    const priceDecimals = price.toFixed(2);

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
        image: image as string,
        details: sanitizedDetails,
        specifications: stringifiedSpec,
      },
    });
    revalidatePath('/products');
    revalidatePath('/store/products');
    revalidatePath(`/product/${itemSlug}`);
    revalidatePath('/');
    return { success: 'Produkts veiksmīgi izveidots!' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};
