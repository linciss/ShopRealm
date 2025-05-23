import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProductPreview } from '@/components/custom/shop/products/product-preview';
import { getFullStoreProductData } from '../../../../../../../data/store';
import initTranslations from '@/app/i18n';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

// generates metadata for the page based on the product id
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const productData = await getFullStoreProductData(id);

  return {
    title: productData?.name,
    description: productData?.description,
  };
}

export default async function ProductPagePreview({ params }: Props) {
  const { id, locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

  const productData = await getFullStoreProductData(id);

  if (!productData) redirect('/store/products');

  return (
    <div className='space-y-4 mx-auto'>
      <div className='flex items-center flex-row gap-4'>
        <Link href={`/store/products`} prefetch={true}>
          <Button aria-label='Product page'>
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className='text-3xl  font-bold md:text-2xl sm:text-xl'>
          {t('prodPreview')}
        </h1>
        <div className='space-x-2 flex-nowrap flex flex-row'></div>
      </div>
      <div className='rounded-lg border border-dashed border-primary/50 p-1'>
        <div className='rounded-md bg-background'>
          <div className='bg-primary/10 text-primary px-4 py-2 text-sm font-medium rounded-t-md'>
            {t('prodPreviewDesc')}
          </div>
          <ProductPreview locale={locale} productData={productData} />
        </div>
      </div>
    </div>
  );
}
