'use server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/db';
import { auth } from '../../auth';

export const createLoginLink = async () => {
  const session = await auth();

  if (!session?.user.id) return { error: 'authError' };

  try {
    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
    });

    if (!store?.stripeAccountId) return { error: 'cantFindStripe' };

    // creates a login link for the user so they can access the stripe dashboard
    const loginLink = await stripe.accounts.createLoginLink(
      store.stripeAccountId,
    );

    return { url: loginLink.url };
  } catch (error) {
    console.error(error);
    return { error: 'failedToCreate' };
  }
};
