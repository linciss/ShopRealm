import { SelectSeparator } from '@/components/ui/select';
import Image from 'next/image';
import { calculateAverageRating, categoryMap } from '@/lib/utils';
import { ReviewStars } from '../review-stars';
import { AddToCart } from './add-to-cart';
import { isItemFavorite } from '../../../../data/favorites';
import { MoreInfo } from './more-info.tsx';
import Link from 'next/link';
import { getUserReview } from '../../../../data/review';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getRelatedProducts } from '../../../../data/product';
import { auth } from '../../../../auth';
import { formatCurrency } from './../../../lib/format-currency';
import initTranslations from '@/app/i18n';
import { Star } from 'lucide-react';
import { ProductGrid } from './product-grid';

interface ProductProps {
  productData:
    | {
        image: string | null;
        featured: boolean;
        id: string;
        name: string;
        createdAt: Date;
        description: string;
        price: string;
        category: string[];
        quantity: number;

        reviews: {
          id: string;
          rating: number;
          comment: string;
          user: {
            name: string;
            id: string;
          };
          createdAt: Date;
        }[];
        details: string;
        specifications: string | null;
        sale: boolean;
        salePrice: string | null;
        store: {
          name: string;
          id: string;
          slug: string;
        } | null;
      }
    | undefined;
  locale: string;
  origin?: string;
}

export const ProductPageInfo = async ({
  productData,
  locale,
  origin,
}: ProductProps) => {
  if (!productData) return;

  const session = await auth();

  const isFav = await isItemFavorite(productData.id);
  const userReview = await getUserReview(productData.id);
  const relatedProducts = await getRelatedProducts(productData.id);

  const { t } = await initTranslations(locale || 'en', [
    'productPage',
    'errors',
    'success',
  ]);

  return (
    <div className=' px-2 md:px-4 '>
      <div className='py-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={origin ? `/${origin}` : '/products'}>
                {t(origin ? origin : 'productHeading')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/products?category=${productData.category[0]}`}
              >
                {t(categoryMap[productData.category[0]].id)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{productData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-0'>
        <div className='border border-muted-foreground rounded-lg h-max overflow-hidden'>
          <Image
            width={600}
            height={600}
            src={(productData.image as string) || ''}
            alt='Product Image'
            className='w-full h-[550px]  object-contain '
          />
        </div>

        <div className='flex flex-col gap-5 px-4'>
          <div className='flex flex-col gap-2'>
            <div className=''>
              <h1 className='text-3xl font-semibold '>{productData.name}</h1>
              <Link
                className='text-muted-foreground text-xs justify-self-end'
                href={`/store/${productData?.store?.slug}`}
                target='_blank'
                prefetch={false}
              >
                {t('shop')}: {productData?.store?.name}
              </Link>
            </div>
            {productData.featured && (
              <>
                <div className=' items-center bg-amber-100 border border-[#f59e0b] text-amber-800 px-2 py-1 rounded-full z-20 text-xs flex flex-row gap-1 w-fit'>
                  <Star fill='#f59e0b' className='h-3 w-3' strokeWidth={0} />
                  {t('featured')}
                </div>
                <div className='text-sm bg-amber-100 border border-[#f59e0b] text-amber-800 p-2 rounded-lg'>
                  <span className='font-semibold'>{t('why')}</span>:{' '}
                  {t('whyDesc')}
                </div>
              </>
            )}
            <div className='flex flex-row items-center gap-1'>
              <ReviewStars
                averageReview={calculateAverageRating(productData.reviews)}
              />
              <p className='text-sm text-muted-foreground'>
                ({productData.reviews.length} {t('reviews')})
              </p>
            </div>
          </div>
          <div className='flex flex-col'>
            {!productData.sale ? (
              <h2 className='text-2xl font-semibold '>
                {formatCurrency(productData.price)}
              </h2>
            ) : (
              <div className='inline-flex gap-2 items-center '>
                <p className='text-xl text-muted-foreground line-through '>
                  {formatCurrency(productData.price)}
                </p>
                <h2 className='text-2xl font-semibold text-red-500'>
                  {formatCurrency(productData.salePrice)}
                </h2>
              </div>
            )}

            <p
              className={`text-sm ${
                productData.quantity < 5 ? 'text-red-600' : 'text-green-800'
              }`}
            >
              {t('stockLeft')} (
              {productData.quantity === 1
                ? `${productData.quantity} ${t('item')}`
                : `${productData.quantity} ${t('items')}`}
              )
            </p>
          </div>
          <SelectSeparator />
          <div>
            <p className='font-medium '>{t('productDescription')}</p>
            <p className='text-muted-foreground'>{productData.description}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='font-medium'>{t('categories')}</p>
            <div className='flex gap-2 flex-wrap'>
              {productData.category.map((category) => (
                <span
                  key={category}
                  className=' py-1 px-3 rounded-full bg-muted text-primary text-xs font-medium'
                >
                  {t(categoryMap[category].id)}
                </span>
              ))}
            </div>
          </div>
          <SelectSeparator />
          <AddToCart
            id={productData.id}
            isFav={isFav || false}
            session={session}
            maxQuantity={productData.quantity}
          />
        </div>
      </div>
      <MoreInfo
        reviews={productData.reviews}
        details={productData.details}
        specifications={productData.specifications || null}
        preview={false}
        userReviewId={userReview}
        locale={locale}
      />

      <div className='mt-5 space-y-5'>
        <h3 className='text-2xl font-semibold'>{t('productsYouMayLike')}</h3>

        <ProductGrid products={relatedProducts || []} lazyLoad={true} />
      </div>
    </div>
  );
};
