import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { createOrdersFromSession } from '@/lib/create-orders';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const paymentIntent = session.payment_intent as string;

      const productData = JSON.parse(session?.metadata?.productData || '[]');

      const unavailableProducts = [];

      for (const item of productData) {
        const product = await prisma.product.findUnique({
          where: { id: item.id },
        });

        if (!product || !product.isActive || product.quantity < item.quantity) {
          unavailableProducts.push(product?.name || item.id);
        }
      }

      if (unavailableProducts.length > 0) {
        await stripe.refunds.create({ payment_intent: paymentIntent });

        return new Response(
          JSON.stringify({
            error: 'Error',
            products: unavailableProducts,
          }),
          { status: 200 },
        );
      }
      await createOrdersFromSession(event.data.object);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    if (err instanceof Error) {
      console.log('Webhook error:', err);
    }
    return NextResponse.json({ error: 'error' }, { status: 400 });
  }
}
