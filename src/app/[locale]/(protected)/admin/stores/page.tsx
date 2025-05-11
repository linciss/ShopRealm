import initTranslations from '@/app/i18n';
import { getStores } from '../../../../../../data/admin';
import { StoresTable } from '@/components/custom/admin/stores-table';

interface StoreProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page: number; search: string }>;
}

export default async function Admin({ params, searchParams }: StoreProps) {
  const { locale } = await params;
  const { page, search } = await searchParams;
  const { t } = await initTranslations(locale, ['productPage']);
  const data = await getStores({ page: page || 1, search });

  const pageCount = Math.ceil((data?.totalStores || 1) / 10);

  return (
    <div className='space-y-4'>
      <div className=''>
        <h1 className='text-3xl font-bold '>{t('storeManagement')}</h1>
      </div>

      <StoresTable stores={data?.stores} t={t} pageCount={pageCount} />
      <StoresTable
        stores={data?.pendingStores}
        t={t}
        pageCount={(data?.totalPendingStores || 1) / 10}
        pending={true}
      />
    </div>
  );
}
