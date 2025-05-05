'use server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/db';
import { auth } from '../../auth';

export async function createConnectAccount() {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  try {
    // creates a connect account for the user
    const account = await stripe.accounts.create({
      type: 'express',
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
      metadata: {
        userId: session.user.id,
      },
    });

    // saves the account id in db for easy access
    await prisma.store.update({
      where: { userId: session.user.id },
      data: { stripeAccountId: account.id },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/settings?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/settings?success=true`,
      type: 'account_onboarding',
    });

    return { url: accountLink.url };
  } catch (error) {
    console.error(error);
    return { error: 'failedToCreateAccount' };
  }
}
