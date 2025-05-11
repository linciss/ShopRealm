import initTranslations from '@/app/i18n';
import { Metadata } from 'next';
import { getProductById } from '../../../../../../../data/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/custom/shop/products/product-form';

interface StoreCreateProps {
  params: Promise<{ locale: string; id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit product',
  description: 'Edit store product',
};

export default async function StoreCreate({ params }: StoreCreateProps) {
  const { locale, id } = await params;

  const { t } = await initTranslations(locale, ['productPage']);
  const productData = await getProductById(id);

  if (!productData) {
    redirect('/admin');
  }

  const product = {
    id: productData.id,
    name: productData.name,
    description: productData.description,
    price: Number(productData.price),
    isActive: productData.isActive,
    image: productData.image,
    category: productData.category,
    details: productData.details,
    specifications: productData.specifications,
    quantity: productData.quantity,
    sale: productData.sale,
    salePrice: Number(productData.salePrice) || 0,
  };

  return (
    <div className='md:max-w-7xl space-y-5'>
      <div className='inline-flex space-x-2'>
        <Link href={`/admin/products`}>
          <Button aria-label='Admin products table'>
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className='text-3xl font-bold'>{t('productConfigurator')}</h1>
      </div>
      <div className=' mx-auto space-y-4'>
        <ProductForm productData={product || null} admin={true} />
      </div>
    </div>
  );
}
