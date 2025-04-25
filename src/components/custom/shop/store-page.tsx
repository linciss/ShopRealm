import { redirect } from 'next/navigation';
import { getStoreDataById } from '../../../../data/store';
import { ProductGrid } from '../products/product-grid';

interface StorePreviewProps {
  id: string;
}

export const StorePreview = async ({ id }: StorePreviewProps) => {
  const storeData = await getStoreDataById(id);

  if (!storeData) redirect('/products');

  return (
    <div className='py-4 space-y-6'>
      <div className='space-y-4'>
        <h1 className='text-3xl font-semibold'>{storeData.name}</h1>
        <p className='text-lg text-muted-foreground'>{storeData.description}</p>
      </div>
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Veikala produkti</h2>
        <ProductGrid products={storeData.products} />
      </div>
    </div>
  );
};
