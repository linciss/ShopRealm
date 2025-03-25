import { ProductTable } from '@/components/custom/shop/products/product-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getProducts } from '../../../../../data/store';

export default async function Products() {
  const products = await getProducts();

  return (
    <div className='space-y-4 '>
      <div className='flex justify-between items-center flex-row gap-4'>
        <h1 className=' font-bold text-3xl '>Produkti</h1>
        <div className='space-x-2 flex-nowrap flex flex-row'>
          <Link href={`/store/products/new`} prefetch={true}>
            <Button>
              <Plus />
              Pievienot preci
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
