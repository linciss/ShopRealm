import prisma from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // secururity layer for cron so people cant access the route
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: 'Nav autorizacija!' },
      {
        status: 401,
      },
    );
  }

  try {
    // finds the orders that have been completed
    const itemsToRelease = await prisma.orderItem.findMany({
      where: {
        escrowStatus: 'holding',
        status: 'complete',
        transferScheduledFor: {
          lte: new Date(),
        },
      },
      include: {
        order: true,
        store: true,
      },
    });
    console.log(`${itemsToRelease.length}`);

    // calculates all the logic
    const results = await Promise.allSettled(
      itemsToRelease.map(async (item) => {
        if (!item.store.stripeAccountId)
          // TODO: CHANGE THE RETURN STATEMENT BECAUSE IM TESTING RN
          // return null
          return await prisma.orderItem.update({
            where: { id: item.id },
            data: {
              escrowStatus: 'released',
            },
          });

        // calculates the fee
        const platformFeePercentage = 0.1;
        const platformFee = item.total * platformFeePercentage;
        const storeAmount = item.total - platformFee;

        // transfers funds to stores stripe account
        const transfer = await stripe.transfers.create({
          amount: Math.round(storeAmount * 100),
          currency: 'eur',
          destination: item.store.stripeAccountId,
          metadata: {
            orderId: item.orderId,
            orderItemId: item.id,
          },
        });

        await prisma.orderItem.update({
          where: { id: item.id },
          data: {
            escrowStatus: 'released',
            transferId: transfer.id,
          },
        });

        return { item: item.id, transfer: transfer.id };
      }),
    );

    return NextResponse.json({
      success: true,
      processed: itemsToRelease.length,
      results,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    console.error('error:', err);
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}
