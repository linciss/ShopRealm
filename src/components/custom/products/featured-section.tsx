import { getProducts } from '../../../../data/product';
import { ProductGrid } from './product-grid';

export const FeaturedProducts = async () => {
  const featured = true;
  const { products } = await getProducts({ page: 1, limit: 4, featured });

  return <ProductGrid products={products} origin='featured' />;
};
