import initTranslations from '@/app/i18n';
import { getProducts } from '../../../../../../data/admin';

import { ProductsTable } from '@/components/custom/admin/products-table';

interface ProductProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page: number; search: string }>;
}

export default async function Admin({ params, searchParams }: ProductProps) {
  const { locale } = await params;
  const { page, search } = await searchParams;
  const { t } = await initTranslations(locale, ['productPage']);
  const data = await getProducts({ page: page || 1, search });
  const pageCount = Math.ceil((data?.totalProducts || 1) / 10);

  return (
    <div className='space-y-4'>
      <div className='flex flex-row justify-between'>
        <h1 className='text-3xl font-bold '>{t('productManagement')}</h1>
      </div>

      <ProductsTable products={data?.products} t={t} pageCount={pageCount} />
    </div>
  );
}
