'use server';
import { stripe } from '@/lib/stripe';

import prisma from '@/lib/db';
import { getUserCart } from '../../data/cart';
import { auth } from '../../auth';

export const createCheckoutSession = async (redirectUrl: string) => {
  const session = await auth();

  if (!session?.user.id) return { error: 'Leitotajs nav autorizets' };

  try {
    const cart = await getUserCart();
    if (!cart) return { error: 'Groza kluda!' };

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
        error: `Produkti: ${productNames} ir vairak neko noliktava!`,
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
        unit_amount: Math.round(parseFloat(item.product.price) * 100),
      },
    }));

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${redirectUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirectUrl}/cart`,
      client_reference_id: session.user.id,
      metadata: {
        cartId: cart.id,
      },
    });

    return { url: stripeSession.url };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
    return { error: 'Kluda ar stripe sesiju!' };
  }
};
