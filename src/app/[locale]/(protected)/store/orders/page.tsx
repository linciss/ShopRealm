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
import { OrderFilter } from '@/components/custom/shop/orders/order-filter';

interface OrderProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    status?: string;
    dateRange?: string;
    sort?: string;
  }>;
}

export default async function Orders({ params, searchParams }: OrderProps) {
  const { status, dateRange, sort } = await searchParams;

  const { filteredOrders, allOrders } = await getOrders({
    status,
    dateRange,
    sort,
  });
  const { locale } = await params;

  const completedOrdersTotal =
    allOrders
      ?.filter((order) => order.status === 'complete')
      .reduce((sum, order) => sum + order.priceAtOrder * order.quantity, 0) ||
    0;

  const pendingOrdersTotal =
    allOrders
      ?.filter(
        (order) => order.status === 'pending' || order.status === 'shipped',
      )
      .reduce((sum, order) => sum + order.priceAtOrder * order.quantity, 0) ||
    0;

  const currentMonthOrders =
    allOrders?.filter((order) => {
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
            value={allOrders?.length}
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
        {filteredOrders ? (
          <div className='grid md:grid-cols-3 grid-cols-1 gap-6'>
            <div className='md:col-span-2'>
              <OrderTable orders={filteredOrders} t={t} />
            </div>
            <OrderFilter
              sort={sort || ''}
              selectedStatus={status || ''}
              dateRange={dateRange || ''}
            />
          </div>
        ) : (
          <div className='animate-spin'>
            <Loader2 />
          </div>
        )}
      </div>
    </div>
  );
}
