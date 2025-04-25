import { ProductGrid } from '@/components/custom/products/product-grid';
import { getFavoriteProducts } from '../../../../data/favorites';
import initTranslations from '@/app/i18n';

interface FavoritePageProps {
  params: Promise<{ locale: string }>;
}
export default async function FavoritePage({ params }: FavoritePageProps) {
  const { locale } = await params;
  const favoriteData = await getFavoriteProducts();
  const favoriteProducts = favoriteData?.map((prod) => prod.product) || [];

  const { t } = await initTranslations(locale, ['productPage']);

  return (
    <div className='mx-auto px-4 py-8 container max-w-7xl'>
      <div className='py-4 space-y-6'>
        <div className='space-y-4'>
          <h1 className='text-3xl font-semibold'>{t('myFavorites')}</h1>
          <p className='text-lg text-muted-foreground'>
            {t('myFavoritesDesc')}
          </p>
        </div>
        <div className='space-y-4'>
          {favoriteProducts?.length === 0 ? (
            <h2>{t('yourFav')}:(</h2>
          ) : (
            <ProductGrid products={favoriteProducts || []} />
          )}
        </div>
      </div>
    </div>
  );
}
