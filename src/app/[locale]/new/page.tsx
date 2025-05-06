import { ProductGrid } from '@/components/custom/products/product-grid';

import { ProductFilters } from '@/components/custom/products/product-filters';
import { ProductSoter } from '@/components/custom/products/product-sorter';
import { ProductPagination } from '@/components/custom/products/product-pagination';
import { Metadata } from 'next';
import { getProducts } from '../../../../data/product';
import initTranslations from '@/app/i18n';

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

  return {
    title: t('newHeading'),
    description: t('newHeadingDesc'),
  };
}

const LIMIT = 20;

export default async function Products({
  searchParams,
  params,
}: ProductsPageProps) {
  const sp = await searchParams;

  const page = Number(sp.page) || 1;
  const search = sp.search || '';
  const category = sp.category || '';
  const minPrice = Number(sp.minPrice) || undefined;
  const maxPrice = Number(sp.maxPrice) || undefined;
  const sort = sp.sort || '';
  const justDropped = true;

  const { products, totalProducts } = await getProducts({
    page,
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    limit: LIMIT,
    justDropped,
  });

  const totalPages = Math.ceil(totalProducts / LIMIT);

  const locale = (await params).locale;
  const { t } = await initTranslations(locale, ['productPage']);

  return (
    <div className=' mx-auto px-4 py-8 container'>
      <h1 className='text-3xl font-bold mb-6'>{t('newHeading')}</h1>
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
          <div className='flex justify-between'>
            <p className='text-muted-foreground'>
              {t('showing')}{' '}
              <span className='text-primary'>{products.length}</span>{' '}
              {t('showingProducts')}
            </p>
            <ProductSoter sort={sort} />
          </div>

          <ProductGrid products={products} origin={'new'} />
        </div>
      </div>
      <ProductPagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
