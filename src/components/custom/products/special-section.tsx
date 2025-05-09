import { getProducts } from '../../../../data/product';
import { ProductGrid } from './product-grid';

export const SaleProducts = async () => {
  const sale = true;
  const { products } = await getProducts({ page: 1, limit: 4, sale });

  return <ProductGrid products={products} origin='sale' />;
};
