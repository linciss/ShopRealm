'use server';
import { stripe } from '@/lib/stripe';

import prisma from '@/lib/db';
import { getUserCart } from '../../data/cart';
import { auth } from '../../auth';
import { z } from 'zod';
import { shippingInfoSchema } from '../../schemas';

export const createCheckoutSession = async (
  redirectUrl: string,
  data: z.infer<typeof shippingInfoSchema>,
  saveInfo: boolean,
) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user?.emailVerified) {
    return { error: 'errorEmail' };
  }

  const validateData = shippingInfoSchema.safeParse(data);

  if (validateData.error) return { error: 'validationError' };

  const { name, lastName, phone, street, city, country, postalCode } =
    validateData.data;

  try {
    if (saveInfo) {
      // if user select that they want to save their data then save  it into database
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          phone,
          address: {
            update: {
              data: {
                street,
                city,
                country,
                postalCode,
              },
            },
          },
        },
      });
    }
    const cart = await getUserCart();
    if (!cart) return { error: 'cartError' };

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });

    const moreThanStock = cartItems.filter((item) => {
      return item.quantity > item.product.quantity;
    });

    if (moreThanStock.length > 0) {
      const productNames = moreThanStock
        .map((item) => item.product.name)
        .join(', ');
      return {
        error: `moreThanInStock`,
        productNames,
      };
    }

    const lineItems = cartItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.name,
          description: item.product.description || undefined,
        },
        unit_amount: Math.round(
          parseFloat(
            item.product.sale
              ? item.product.salePrice || item.product.price
              : item.product.price,
          ) * 100,
        ),
      },
    }));

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      payment_intent_data: {
        metadata: {
          orderType: 'escrow',
          storeIds: JSON.stringify(
            cartItems
              .map((item) => item.product.storeId)
              .filter((v, i, a) => a.indexOf(v) === i),
          ),
        },
      },
      success_url: `${redirectUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirectUrl}/cart`,
      client_reference_id: session.user.id,
      customer_email: session.user.email as string,
      metadata: {
        cartId: cart.id,
        name,
        lastName,
        email: session.user.email as string,
        phone,
        street,
        city,
        country,
        postalCode,
        productData: JSON.stringify(
          cartItems.map((item) => ({
            id: item.product.id,
            quantity: item.quantity,
          })),
        ),
      },
    });

    return { url: stripeSession.url };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
    return { error: 'errorWithSession' };
  }
};
