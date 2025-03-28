import { ProductCard } from '../product-card';

interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  reviews: {
    rating: number;
  }[];
}

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  console.log(products);
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {products.map((prod) => (
        <ProductCard key={prod.id} productData={prod} />
      ))}
    </div>
  );
};
