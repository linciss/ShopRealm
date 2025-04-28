import { ProductTable } from '@/components/custom/shop/products/product-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getProducts } from '../../../../../../data/store';
import initTranslations from '@/app/i18n';

interface ProductsProps {
  params: Promise<{ locale: string }>;
}

export default async function Products({ params }: ProductsProps) {
  const products = await getProducts();
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

  return (
    <div className='space-y-4 '>
      <div className='flex justify-between items-center flex-row gap-4'>
        <h1 className=' font-bold text-3xl '>{t('productHeading')}</h1>
        <div className='space-x-2 flex-nowrap flex flex-row'>
          <Link
            href={`/store/products/configurator`}
            prefetch={true}
            aria-label='Product configurator'
          >
            <Button aria-label='Product configurator'>
              <Plus />
              {t('addProduct')}
            </Button>
          </Link>
        </div>
      </div>
      <div className=''>
        <ProductTable initialProducts={products} />
      </div>
    </div>
  );
}
