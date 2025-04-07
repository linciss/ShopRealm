import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getProduct } from '../../../../data/product';
import { ProductPageInfo } from '@/components/custom/products/product-page-info';

type Props = {
  params: Promise<{ id: string }>;
};

// generates metadata for the page based on the product id
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const productData = await getProduct(id);

  return {
    title: productData?.name,
    description: productData?.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const productData = await getProduct(id);

  if (!productData) redirect('/products');

  return (
    <div className='space-y-4  max-w-7xl mx-auto '>
      <ProductPageInfo productData={productData} />
    </div>
  );
}
