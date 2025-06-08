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
import { sendSaleEmail } from '../emailing/email';
import { optimizedImage } from '@/lib/imageUtils';

export const editProduct = async (
  data: z.infer<typeof productSchema>,
  productId: string,
) => {
  const session = await auth();

  //   console.log(data);

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
    const userId = session.user.id;

    const storeId = (await getStoreId()) as string;

    if (!storeId && !session.user.admin) return { error: 'storeError' };

    if (!session.user.admin) {
      const isStoreProduct = await prisma.store.findUnique({
        where: { userId },
        select: {
          products: {
            where: { id: productId },
          },
        },
      });

      if (!isStoreProduct?.products.length) {
        return { error: 'notYourProduct' };
      }
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { sale: true },
    });

    if (!existingProduct) return { error: 'prodNotFound' };

    const UUID = nanoid(6);
    const itemSlug = `${slugify(name).toLowerCase()}-${UUID}`;
    const priceDecimals = price.toFixed(2);
    const salePriceDecimals = salePrice?.toFixed(2);

    if (
      (sale && salePrice !== undefined && salePrice >= price) ||
      (sale && salePrice !== undefined && salePrice < 1)
    ) {
      return { error: 'salePriceError' };
    }

    const optimizedBuffer = await optimizedImage(image);

    const stringifiedSpec = JSON.stringify(specifications);

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: priceDecimals,
        quantity,
        category,
        isActive: checkIfActive,
        slug: itemSlug,
        image: optimizedBuffer as string,
        details: sanitizedDetails,
        specifications: stringifiedSpec,
        sale,
        salePrice: salePriceDecimals,
      },
    });

    revalidatePath('/store/products');

    // send email to users who have this product in their favorites
    if (!existingProduct.sale && sale) {
      const favoriteListsUsers = await prisma.favoriteItem.findMany({
        where: {
          productId,
          favoriteList: {
            is: {
              user: {
                isNot: undefined,
              },
            },
          },
        },
        select: {
          favoriteList: {
            select: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });

      const emails = favoriteListsUsers.map(
        (item) => item.favoriteList?.user?.email,
      );

      const uniqueEmails = [...new Set(emails)];

      if (uniqueEmails.length === 0) {
        return { success: 'edited' };
      }

      await sendSaleEmail(productId, uniqueEmails, name);
    }

    return { success: 'edited' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'validationError' };
  }
};
