import { cache } from 'react';
import { auth } from '../../../../auth';
import { getFavoriteItems } from '../../../../data/favorites';
import { headers } from 'next/headers';
import { isMobile } from '@/lib/utils';
import { LazyProductCard } from '../lazy-card-wrapper';

interface Product {
  id: string;
  slug?: string;
  name: string;
  image: string | null;
  price: string;
  reviews: {
    rating: number;
  }[];
  quantity: number;
  sale: boolean;
  salePrice: string | null;
  featured: boolean;
}

interface ProductGridProps {
  products: Product[];
  origin?: string;
  lazyLoad?: boolean;
}

const getAuthData = cache(async () => {
  return await auth();
});

const getFavoritesData = cache(async () => {
  return await getFavoriteItems();
});

export const ProductGrid = async ({
  products,
  origin,
  lazyLoad = false,
}: ProductGridProps) => {
  const [session, favoriteItems] = await Promise.all([
    getAuthData(),
    getFavoritesData(),
  ]);
  const userAgent = (await headers()).get('user-agent') || '';
  const mobile = isMobile(userAgent);

  const priorityNumber = !lazyLoad ? (mobile ? 3 : 9) : 0;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
      {products.map((prod, index) => (
        <LazyProductCard
          key={prod.id}
          productData={prod}
          favoriteItems={favoriteItems}
          session={session || null}
          origin={origin}
          isPriority={index < priorityNumber}
        />
      ))}
    </div>
  );
};
