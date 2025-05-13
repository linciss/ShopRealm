import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import initTranslations from '../i18n';
import { CategoryGrid } from '@/components/custom/category-grid';
import { FeaturedProducts } from '@/components/custom/products/featured-section';
import { SaleProducts } from '@/components/custom/products/special-section';
import { NewArrivals } from '@/components/custom/products/new-arrivals';
import { NavSearch } from '@/components/custom/nav-search';

interface HomeProps {
  params: Promise<{ locale: string }>;
}
export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ['productPage']);

  return (
    <main className='min-h-screen bg-background'>
      <section className='relative bg-background pt-16 pb-8'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col items-center text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-foreground'>
              {t('discover')} <span className='text-primary'>Shop Realm</span>
            </h1>
            <p className='mt-4 text-lg text-muted-foreground max-w-2xl'>
              {t('find')}
            </p>

            <div className='w-full max-w-2xl mt-6'>
              <NavSearch />
            </div>
          </div>
        </div>
      </section>

      <section className='py-8 bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>{t('shopByCategory')}</h2>
            <Link
              href='/products'
              className='text-primary flex items-center hover:underline'
              prefetch={false}
            >
              {t('viewAllProd')} <ArrowRight className='ml-1 h-4 w-4' />
            </Link>
          </div>
          <CategoryGrid t={t} />
        </div>
      </section>

      <section className='py-6'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>{t('featuredProducts')}</h2>
            <Button variant='link' asChild>
              <Link
                href='/featured'
                className='text-primary flex items-center hover:underline'
                prefetch={false}
              >
                {t('viewAllProd')} <ArrowRight className='ml-1 h-4 w-4' />
              </Link>
            </Button>
          </div>

          <FeaturedProducts />
        </div>
      </section>

      <section className='py-12 bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>{t('saleHeading')}</h2>
            <Button variant='link' asChild>
              <Link
                href='/sale'
                className='text-primary flex items-center'
                prefetch={false}
              >
                {t('viewAllOffers')} <ArrowRight className='ml-1 h-4 w-4' />
              </Link>
            </Button>
          </div>

          <SaleProducts />
        </div>
      </section>

      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>{t('newHeading')}</h2>
            <Button variant='link' asChild>
              <Link
                href='/products?sort=newest'
                className='text-primary flex items-center'
              >
                {t('newDesc')} <ArrowRight className='ml-1 h-4 w-4' />
              </Link>
            </Button>
          </div>
          <NewArrivals />
        </div>
      </section>
    </main>
  );
}
