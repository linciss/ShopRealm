import { getOrderBySessionId } from '../../../../../actions/orders/get-order';
import { redirect } from 'next/navigation';
import initTranslations from '@/app/i18n';
import Link from 'next/link';

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

  // checks if order has been craeted
  const order = await getOrderBySessionId(sessionId);

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

          <Link
            href='/products'
            className='btn btn-primary mt-4 hover:underline'
          >
            {t('continueShopping')}
          </Link>
        </>
      ) : (
        <>
          <h1 className='text-2xl font-bold'>{t('orderFailed')}</h1>

          <div>
            <p>{t('orderFailedDesc')}</p>
          </div>

          <Link
            href='/products'
            className='btn btn-primary mt-4 hover:underline'
          >
            {t('continueShopping')}
          </Link>
        </>
      )}
    </div>
  );
}
