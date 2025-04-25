import { Metadata } from 'next';
import { getStoreNameById } from '../../../../../data/store';

import { StorePreview } from '@/components/custom/shop/store-page';

interface StorePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { id } = await params;

  const productData = await getStoreNameById(id);

  return {
    title: productData?.name,
    description: productData?.description,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { id } = await params;

  return (
    <div className='mx-auto px-4 py-8 container max-w-7xl'>
      <StorePreview id={id} />
    </div>
  );
}
