import initTranslations from '@/app/i18n';
import { ProductForm } from '@/components/custom/shop/products/product-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductsProps {
  params: Promise<{ locale: string }>;
}

export default async function Store({ params }: ProductsProps) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

  return (
    <div className='space-y-4 mx-auto'>
      <div className='flex items-center flex-row gap-4'>
        <Link
          href={`/store/products`}
          prefetch={true}
          aria-label='Product configurator'
        >
          <Button aria-label='Product configurator'>
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className='text-3xl  font-bold md:text-2xl sm:text-xl'>
          {t('newProduct')}
        </h1>
        <div className='space-x-2 flex-nowrap flex flex-row'></div>
      </div>
      <div className=' mx-auto space-y-4'>
        <ProductForm />
      </div>
    </div>
  );
}
