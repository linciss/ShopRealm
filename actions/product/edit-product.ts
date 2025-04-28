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

export const editProduct = async (
  data: z.infer<typeof productSchema>,
  productId: string,
) => {
  const session = await auth();

  //   console.log(data);

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

    if (!storeId) return { error: 'Nav veikals atrasts' };

    const isStoreProduct = await prisma?.store.findUnique({
      where: { userId },
      select: {
        products: {
          where: {
            id: productId,
          },
        },
      },
    });

    if (!isStoreProduct) return { error: 'Nav jsuu produkts' };

    const UUID = nanoid(6);
    const itemSlug = `${slugify(name).toLowerCase()}-${UUID}`;
    const priceDecimals = price.toFixed(2);
    const salePriceDecimals = salePrice?.toFixed(2);

    if (sale && salePrice !== undefined && salePrice >= price) {
      return { error: 'salePrice' };
    }

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
        image: image as string,
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

    // send email to users who have this product in their favorites
    if (!isStoreProduct.products[0].sale && sale) {
      const favoriteListsUsers = await prisma.favoriteItem.findMany({
        where: { productId },
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
        return { success: 'Produkts veiksmīgi redigets!' };
      }

      await sendSaleEmail(productId, uniqueEmails);
    }

    return { success: 'Produkts veiksmīgi redigets!' };
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return { error: 'Kļūda apstrādājot datus' };
  }
};
