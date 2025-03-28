import { redirect } from 'next/navigation';
import { getProductData } from '../../../../../../../data/store';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/custom/shop/products/product-form';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductEdit({ params }: Props) {
  const { id } = await params;

  const productData = await getProductData(id);

  if (!productData) redirect('/store/products');

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
  };

  return (
    <div className='space-y-4 mx-auto'>
      <div className='flex items-center flex-row gap-4'>
        <Link href={`/store/products`} prefetch={true}>
          <Button>
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className='text-3xl  font-bold md:text-2xl sm:text-xl'>
          Jauna prece
        </h1>
        <div className='space-x-2 flex-nowrap flex flex-row'></div>
      </div>
      <div className=' mx-auto space-y-4'>
        <ProductForm productData={product || null} />
      </div>
    </div>
  );
}
