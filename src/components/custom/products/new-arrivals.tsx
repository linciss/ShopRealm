import { getProducts } from '../../../../data/product';
import { ProductGrid } from './product-grid';

export const NewArrivals = async () => {
  const { products } = await getProducts({ page: 1, limit: 4, sort: 'newest' });

  return <ProductGrid products={products} />;
};
