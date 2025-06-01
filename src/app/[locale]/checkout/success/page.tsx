import { getOrderBySessionId } from '../../../../../actions/orders/get-order';
import { redirect } from 'next/navigation';
import initTranslations from '@/app/i18n';
import Link from 'next/link';
import { auth } from '../../../../../auth';
import prisma from '@/lib/db';
import { sendOrderConfirmation } from '@/../actions/emailing/email';

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
  const session = await auth();

  if (!session?.user.id) {
    redirect('/auth/sign-in');
    return null;
  }
  const sp = await searchParams;
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

  const sessionId = sp.session_id;

  if (!sessionId) {
    redirect('/');
    return null;
  }
  const email = session.user ? session?.user?.email : '';

  // checks if order has been craeted
  const order = await getOrderBySessionId(sessionId);

  if (order && !order.confirmationSent) {
    try {
      const items = order.orderItems.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.priceAtOrder,
        total: item.total,
      }));

      const shippingInfo = {
        street: order.orderItems[0].shippingStreet || '',
        city: order.orderItems[0].shippingCity || '',
        country: order.orderItems[0].shippingCountry || '',
        postalCode: order.orderItems[0].shippingPostalCode || '',
      };

      const data = {
        shippingInfo,
        items,
      };

      await sendOrderConfirmation(order.id, email as string, locale, data);

      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          confirmationSent: true,
        },
      });
    } catch (error) {
      console.error('Failed:', error);
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
