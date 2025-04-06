import { auth } from '../../../../auth';
import { ProductCard } from '../product-card';

interface Product {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  price: string;
  reviews: {
    rating: number;
  }[];
}

interface Favorite {
  id: string;
  productId: string;
}

interface ProductGridProps {
  products: Product[];
  favoriteItems?: Favorite[] | undefined;
}

export const ProductGrid = async ({
  products,
  favoriteItems,
}: ProductGridProps) => {
  const session = await auth();
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {products.map((prod) => (
        <ProductCard
          key={prod.id}
          productData={prod}
          favoriteItems={favoriteItems}
          session={session || null}
        />
      ))}
    </div>
  );
};
