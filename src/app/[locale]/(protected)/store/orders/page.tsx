import {
  CalendarClock,
  Clock,
  CreditCard,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { getOrders } from '../../../../../../data/orders';
import { StatCard } from '@/components/custom/shop/stat-card';
import { formatCurrency } from '@/lib/format-currency';
import { OrderTable } from '@/components/custom/shop/orders/order-table';
import initTranslations from '@/app/i18n';

interface OrderProps {
  params: Promise<{ locale: string }>;
}

export default async function Orders({ params }: OrderProps) {
  const orders = await getOrders();
  const { locale } = await params;

  const completedOrdersTotal =
    orders
      ?.filter((order) => order.status === 'complete')
      .reduce((sum, order) => sum + order.priceAtOrder * order.quantity, 0) ||
    0;

  const pendingOrdersTotal =
    orders
      ?.filter(
        (order) => order.status === 'pending' || order.status === 'shipped',
      )
      .reduce((sum, order) => sum + order.priceAtOrder * order.quantity, 0) ||
    0;

  const currentMonthOrders =
    orders?.filter((order) => {
      const orderDate = new Date(order.order.createdAt);

      const now = new Date();

      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }) || [];

  const { t } = await initTranslations(locale, ['productPage']);

  return (
    <div className='space-y-4 '>
      <div className='flex flex-col gap-4'>
        <h1 className=' font-bold text-3xl '>{t('orders')}</h1>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            name={t('allOrders')}
            value={orders?.length}
            icon={<ShoppingBag />}
          />
          <StatCard
            name={t('completedIncome')}
            value={formatCurrency(completedOrdersTotal)}
            icon={<CreditCard />}
            description={t('completedOrders')}
          />
          <StatCard
            name={t('pendingIncome')}
            value={formatCurrency(pendingOrdersTotal)}
            icon={<Clock />}
            description={t('waitingCompletion')}
          />
          <StatCard
            name={t('thisMonth')}
            value={currentMonthOrders.length}
            icon={<CalendarClock />}
          />
        </div>
      </div>
      <div className=''>
        {orders ? (
          <OrderTable orders={orders} t={t} />
        ) : (
          <div className='animate-spin'>
            <Loader2 />
          </div>
        )}
      </div>
    </div>
  );
}
