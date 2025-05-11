import initTranslations from '@/app/i18n';
import { getDashboardData, getPendingStores } from '../../../../../data/admin';
import { StatCard } from '@/components/custom/shop/stat-card';
import { Package, Store, User } from 'lucide-react';
import { StoresTable } from '@/components/custom/admin/stores-table';

interface StoreProps {
  params: Promise<{ locale: string }>;
}

export default async function Admin({ params }: StoreProps) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

  const data = await getDashboardData();
  const pendingStores = await getPendingStores();

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
      <StoresTable stores={pendingStores} t={t} pageCount={0} pending={true} />
    </div>
  );
}
