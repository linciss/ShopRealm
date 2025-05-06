import { auth } from '../../../../auth';
import { getFavoriteItems } from '../../../../data/favorites';
import { ProductCard } from '../product-card';

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
}

interface ProductGridProps {
  products: Product[];
  origin?: string;
}

export const ProductGrid = async ({ products, origin }: ProductGridProps) => {
  const session = await auth();
  const favoriteItems = await getFavoriteItems();

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {products.map((prod) => (
        <ProductCard
          key={prod.id}
          productData={prod}
          favoriteItems={favoriteItems}
          session={session || null}
          origin={origin}
        />
      ))}
    </div>
  );
};
