import { ProductGrid } from '@/components/custom/products/product-grid';
import { getFavoriteProducts } from '../../../../data/favorites';

export default async function FavoritePage() {
  const favoriteData = await getFavoriteProducts();

  const favoriteProducts = favoriteData?.map((prod) => prod.product) || [];

  return (
    <div className='mx-auto px-4 py-8 container max-w-7xl'>
      <div className='py-4 space-y-6'>
        <div className='space-y-4'>
          <h1 className='text-3xl font-semibold'>Mani favoriti</h1>
          <p className='text-lg text-muted-foreground'>
            Sie ir favoritu produkti, ja tie ies uz atlaidi vai produkts atkal
            bus pieejams, tad jums atnaks zinojums uz epastu
          </p>
        </div>
        <div className='space-y-4'>
          {favoriteProducts?.length === 0 ? (
            <h2>Jums nav favoritu produkti :(</h2>
          ) : (
            <ProductGrid products={favoriteProducts || []} />
          )}
        </div>
      </div>
    </div>
  );
}
