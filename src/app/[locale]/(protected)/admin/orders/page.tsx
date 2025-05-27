import initTranslations from '@/app/i18n';
import { getOrders } from '../../../../../../data/admin';
import { OrdersTable } from '@/components/custom/admin/orders-table';

interface ProductProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page: number; search: string }>;
}

export default async function Admin({ params, searchParams }: ProductProps) {
  const { locale } = await params;
  const { page, search } = await searchParams;
  const { t } = await initTranslations(locale, ['productPage']);
  const data = await getOrders({ page: page || 1, search });
  const pageCount = Math.ceil((data?.totalOrders || 1) / 10);

  return (
    <div className='space-y-4'>
      <div className='flex flex-row justify-between'>
        <h1 className='text-3xl font-bold '>{t('productManagement')}</h1>
      </div>

      <OrdersTable orders={data?.orders} t={t} pageCount={pageCount} />

      <OrdersTable
        orders={data?.ordersToReview}
        t={t}
        pageCount={pageCount}
        review={true}
      />
    </div>
  );
}
