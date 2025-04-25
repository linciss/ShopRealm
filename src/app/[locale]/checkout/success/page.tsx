import { stripe } from '@/lib/stripe';
import { getOrderBySessionId } from '../../../../../actions/orders/get-order';
import { createOrdersFromSession } from '@/lib/create-orders';
import { redirect } from 'next/navigation';
import initTranslations from '@/app/i18n';

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
  params: Promise<{ locale: string }>;
}

export default async function SuccessPage({
  searchParams,
  params,
}: SuccessPageProps) {
  const sp = await searchParams;
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

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
      return { error: t('error') };
    }
  }

  return (
    <div className='container py-10 text-center'>
      {order ? (
        <>
          <h1 className='text-2xl font-bold'>{t('thanks')}</h1>

          <div>
            <p>
              {t('orderNr')}: {order.id}
            </p>
          </div>
        </>
      ) : (
        <p>{t('orderProcessed')}</p>
      )}
    </div>
  );
}
