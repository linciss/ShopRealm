import initTranslations from '@/app/i18n';
import { getDashboardData } from '../../../../../data/admin';
import { StatCard } from '@/components/custom/shop/stat-card';
import { Package, Store, User } from 'lucide-react';

interface StoreProps {
  params: Promise<{ locale: string }>;
}

export default async function Admin({ params }: StoreProps) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

  const data = await getDashboardData();

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center flex-row gap-4'>
        <h1 className='text-3xl font-bold '>{t('adminPanel')}</h1>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <StatCard
          name={t('totalUsers')}
          value={data?.totalUsers}
          icon={<User className='h-[16px] w-[16px]' />}
        />
        <StatCard
          name={t('totalStores')}
          value={data?.totalStores}
          icon={<Store className='h-[16px] w-[16px]' />}
        />
        <StatCard
          name={t('totalProducts')}
          value={data?.totalProducts}
          icon={<Package className='h-[16px] w-[16px]' />}
        />
      </div>
      <div className='grid md:grid-cols-3 grid-cols-1 gap-6'>
        <div className='md:col-span-2'>{/* <OrdersChart days={days} /> */}</div>
        {/* <RecentOrders recentOrders={recentOrders || []} t={t} /> */}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* <TopProducts topProducts={data?.topSelling || []} t={t} />
        <InventoryStatus attentionItems={data?.attentionItems || []} t={t} />
        <RecentReviews recentReviews={data?.recentReviews || []} t={t} /> */}
      </div>
    </div>
  );
}
