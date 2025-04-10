import { ProductGrid } from '@/components/custom/products/product-grid';
import { getProducts } from '../../../data/product';
import { getFavoriteItems } from '../../../data/favorites';
import { ProductFilters } from '@/components/custom/products/product-filters';

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export default async function Products({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;

  const page = Number(sp.page) || 1;
  const search = sp.search || '';
  const category = sp.category || '';
  const minPrice = Number(sp.minPrice) || undefined;
  const maxPrice = Number(sp.maxPrice) || undefined;
  const sort = sp.sort || 'newest';

  const { products } = await getProducts({
    page,
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    limit: 10,
  });

  const favoriteItems = await getFavoriteItems();

  return (
    <div className=' mx-auto px-4 py-8 container'>
      <h1 className='text-3xl font-bold mb-6'>Produkti</h1>
      <div className='flex  gap-10 md:flex-row flex-col'>
        <div className='w-full md:w-64 shrink-0'>
          <ProductFilters
            selectedCategory={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            search={search}
          />
        </div>
        <div className='flex-1 space-y-2'>
          <p className='text-muted-foreground'>
            Rada <span className='text-primary'>{products.length}</span>{' '}
            produktus
          </p>
          <ProductGrid products={products} favoriteItems={favoriteItems} />
        </div>
      </div>
    </div>
  );
}
