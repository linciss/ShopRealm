import { NewProductForm } from '@/components/custom/shop/products/new-product-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function Store() {
  return (
    <div className='space-y-4 p-8 pt-6 mx-auto'>
      <div className='flex items-center flex-row gap-4'>
        <Link href={`/store/items`}>
          <Button>
            <ArrowLeft />
            Atpakal
          </Button>
        </Link>
        <h1 className='text-3xl  font-bold md:text-2xl sm:text-xl'>
          Jauna prece
        </h1>
        <div className='space-x-2 flex-nowrap flex flex-row'></div>
      </div>
      <div className='flex lg:flex-row flex-col gap-4 max-w-7xl mx-auto '>
        <NewProductForm />
      </div>
    </div>
  );
}
