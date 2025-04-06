import { stripe } from '@/lib/stripe';
import { getOrderBySessionId } from '../../../../actions/orders/get-order';
import { createOrdersFromSession } from '@/lib/create-orders';
import { redirect } from 'next/navigation';

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sp = await searchParams;

  const sessionId = sp.session_id;

  if (!sessionId) {
    redirect('/');
    return null;
  }

  let order = await getOrderBySessionId(sessionId);

  if (!order && sessionId) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

      await createOrdersFromSession(stripeSession);

      order = await getOrderBySessionId(sessionId);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
      return { error: 'Kluda!' };
    }
  }

  return (
    <div className='container py-10 text-center'>
      {order ? (
        <>
          <h1 className='text-2xl font-bold'>Paldies par pirkumu!</h1>

          <div>
            <p>Pasutijuma Nr: {order.id}</p>
          </div>
        </>
      ) : (
        <p>Jūsu pasūtījums tiek apstrādāts...</p>
      )}
    </div>
  );
}
