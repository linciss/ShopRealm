import { Metadata } from 'next';
import { getStoreDataById, getStoreNameById } from '../../../../../data/store';

import { redirect } from 'next/navigation';
import { ProductGrid } from '@/components/custom/products/product-grid';
import initTranslations from '@/app/i18n';

interface StorePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { id } = await params;

  const productData = await getStoreNameById(id);

  return {
    title: productData?.name,
    description: productData?.description,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { id, locale } = await params;

  const storeData = await getStoreDataById(id);
  const { t } = await initTranslations(locale, ['productPage']);

  if (!storeData) redirect('/products');

  return (
    <div className='mx-auto px-4 py-8 container max-w-7xl'>
      <div className='py-4 space-y-6'>
        <div className='space-y-4'>
          <h1 className='text-3xl font-semibold'>{storeData.name}</h1>
          <p className='text-lg text-muted-foreground'>
            {storeData.description}
          </p>
        </div>

        <div className='space-y-4'>
          <h2 className='text-2xl font-semibold'>{t('productHeading')}</h2>
          {storeData.products.length > 0 ? (
            <ProductGrid products={storeData.products} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
