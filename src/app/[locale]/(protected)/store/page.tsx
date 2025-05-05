import initTranslations from '@/app/i18n';
import { StatCard } from '@/components/custom/shop/stat-card';
import { Button } from '@/components/ui/button';
import { CalendarClock, CreditCard, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/format-currency';
import { getAllDashboardStats } from '../../../../../data/store';
import { OrdersChart } from '@/components/custom/orders-chart';
import { RecentOrders } from '@/components/custom/shop/stats/recent-orders';
import { TopProducts } from '@/components/custom/shop/stats/top-products';
import { InventoryStatus } from '@/components/custom/shop/stats/inventory-status';
import { RecentReviews } from '@/components/custom/shop/stats/recent-reviews';

interface StoreProps {
  params: Promise<{ locale: string }>;
}

export default async function Store({ params }: StoreProps) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

  const data = await getAllDashboardStats();

  const completedOrdersTotal =
    data?.allOrderItems
      ?.filter((order) => order.status === 'complete')
      .reduce((sum, order) => sum + order.priceAtOrder * order.quantity, 0) ||
    0;

  const currentMonthOrders =
    data?.allOrderItems.filter((order) => {
      const orderDate = new Date(order.order.createdAt);

      const now = new Date();

      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }) || [];

  const days: Record<string, number> = {};

  data?.orderThisWeek.forEach((order) => {
    const dayIndex = new Date(order.createdAt).toISOString().split('T')[0];
    days[dayIndex] = (days[dayIndex] || 0) + 1;
  });

  const recentOrders = data?.orderThisWeek
    .filter((order) => order.status !== 'complete')
    .map((order) => {
      return {
        id: order.id,
        total: order.total,
      };
    })
    .slice(0, 5);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center flex-row gap-4'>
        <h1 className='text-3xl font-bold '>{t('panel')}</h1>
        <div className='space-x-2 flex-nowrap flex flex-row'>
          <Link href={`/store/products`}>
            <Button aria-label='Add item'>
              <Plus />
              {t('addProduct')}
            </Button>
          </Link>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          name={t('allProducts')}
          value={data?.productCount}
          icon={<ShoppingBag className='h-[16px] w-[16px]' />}
        />
        <StatCard
          name={t('allOrders')}
          value={data?.allOrderItems.length}
          icon={<ShoppingBag className='h-[16px] w-[16px]' />}
        />
        <StatCard
          name={t('completedIncome')}
          value={formatCurrency(completedOrdersTotal)}
          icon={<CreditCard className='h-[16px] w-[16px]' />}
        />

        <StatCard
          name={t('thisMonth')}
          value={currentMonthOrders.length}
          icon={<CalendarClock className='h-[16px] w-[16px]' />}
        />
      </div>
      <div className='grid md:grid-cols-3 grid-cols-1 gap-6'>
        <div className='md:col-span-2'>
          <OrdersChart days={days} />
        </div>
        <RecentOrders recentOrders={recentOrders || []} t={t} />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <TopProducts topProducts={data?.topSelling || []} t={t} />
        <InventoryStatus attentionItems={data?.attentionItems || []} t={t} />
        <RecentReviews recentReviews={data?.recentReviews || []} t={t} />
      </div>
    </div>
  );
}
