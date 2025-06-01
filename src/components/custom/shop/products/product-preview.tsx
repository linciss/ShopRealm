import { SelectSeparator } from '@/components/ui/select';
import Image from 'next/image';
import { AddToCart } from './add-to-cart-preview';
import { calculateAverageRating, categoryMap } from '@/lib/utils';
import { MoreInfo } from '../../products/more-info.tsx';
import { ReviewStars } from '../../review-stars';
import { formatCurrency } from './../../../../lib/format-currency';
import initTranslations from '@/app/i18n';
import { Star } from 'lucide-react';

interface ProductProps {
  productData:
    | {
        image: string | null;
        featured: boolean;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        price: string;
        category: string[];
        quantity: number;
        isActive: boolean;
        storeId: string | null;
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
      }
    | undefined;
  locale: string;
}
export const ProductPreview = async ({ productData, locale }: ProductProps) => {
  if (!productData) return;

  const { t } = await initTranslations(locale || 'en', [
    'productPage',
    'errors',
    'success',
  ]);

  return (
    <div className=' px-1 md:px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-0'>
        <div className='border border-muted-foreground rounded-lg  '>
          <Image
            width={600}
            height={600}
            src={(productData.image as string) || ''}
            alt='Product Image'
            className=' h-[550px]  object-contain '
          />
        </div>

        <div className='flex flex-col gap-5 px-4'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-semibold '>{productData.name}</h1>
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
          <AddToCart />
        </div>
      </div>
      <MoreInfo
        reviews={productData.reviews}
        details={productData.details}
        specifications={productData.specifications || null}
        locale={locale}
      />
    </div>
  );
};
