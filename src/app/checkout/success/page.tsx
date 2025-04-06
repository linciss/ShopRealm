import { stripe } from '@/lib/stripe';
import { getOrderBySessionId } from '../../../../actions/orders/get-order';
import { createOrdersFromSession } from '@/lib/create-orders';
import { redirect } from 'next/navigation';

interface Session {
  session_id: string;
}

interface SuccessPageProps {
  searchParams: Session;
}
export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  let order = await getOrderBySessionId(sessionId);

  if (!order && sessionId) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

      await createOrdersFromSession(stripeSession);

      order = await getOrderBySessionId(sessionId);

      if (order) {
        setTimeout(() => {
          redirect('/');
        }, 3000);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
      return { error: 'Kluda!' };
    }
  }

  return (
    <div className='container py-10 text-center'>
      <h1 className='text-2xl font-bold'>Paldies par pirkumu!</h1>
      {order ? (
        <div>
          <p>Pasutijuma Nr: {order.id}</p>
        </div>
      ) : (
        <p>Jūsu pasūtījums tiek apstrādāts...</p>
      )}
    </div>
  );
}
