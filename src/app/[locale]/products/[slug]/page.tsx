import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getProduct } from '../../../../../data/product';
import { ProductPageInfo } from '@/components/custom/products/product-page-info';
import { ViewTracker } from '@/components/custom/products/view-tracker';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
  searchParams?: Promise<{ origin?: string }>;
};

// generates metadata for the page based on the product id
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const productData = await getProduct(slug);

  return {
    title: productData?.name,
    description: productData?.description,
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const sp = await searchParams;
  const origin = sp?.origin || '';

  const productData = await getProduct(slug);

  if (!productData || productData.quantity <= 0) redirect('/products');

  return (
    <div className='space-y-4  max-w-7xl mx-auto '>
      <ProductPageInfo
        productData={productData}
        locale={locale}
        origin={origin}
      />
      <ViewTracker productId={productData.id} />
    </div>
  );
}
