import { SelectSeparator } from '@/components/ui/select';
import Image from 'next/image';
import { calculateAverageRating, categoryMap } from '@/lib/utils';
import { ReviewStars } from '../review-stars';
import { AddToCart } from './add-to-cart';
import { isItemFavorite } from '../../../../data/favorites';
import { MoreInfo } from './more-info.tsx';
import Link from 'next/link';
import { getUserReview } from '../../../../data/review';

interface ProductProps {
  productData:
    | {
        image: string | null;
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
          };
          createdAt: Date;
        }[];
        details: string;
        specifications: string | null;
        store: {
          name: string;
          id: string;
        };
      }
    | undefined;
}
export const ProductPageInfo = async ({ productData }: ProductProps) => {
  if (!productData) return;

  const isFav = await isItemFavorite(productData.id);
  const userReview = await getUserReview(productData.id);

  return (
    <div className=' px-2 md:px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-0'>
        <div className='border border-muted-foreground rounded-lg'>
          <Image
            width={600}
            height={600}
            src={(productData.image as string) || ''}
            alt='Product Image'
            className='w-auto h-[550px]  object-contain '
          />
        </div>

        <div className='flex flex-col gap-5 px-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2 items-center'>
              <h1 className='text-3xl font-semibold '>{productData.name}</h1>
              <Link
                className='text-muted-foreground text-xs justify-self-end'
                href={`/store/${productData.store.id}`}
                target='_blank'
              >
                Veikals: {productData.store.name}
              </Link>
            </div>
            <div className='flex flex-row items-center gap-1'>
              <ReviewStars
                averageReview={calculateAverageRating(productData.reviews)}
              />
              <p className='text-sm text-muted-foreground'>
                ({productData.reviews.length} atsauksmes)
              </p>
            </div>
          </div>
          <div className='flex flex-col'>
            <h3 className='text-3xl font-semibold'>€{productData.price}</h3>
            <p
              className={`text-sm  ${
                productData.quantity < 5 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              Atlicis nolitava (
              {productData.quantity === 1
                ? `${productData.quantity} gabals`
                : `${productData.quantity} gabali`}
              )
            </p>
          </div>
          <SelectSeparator />
          <div>
            <p className='font-medium '>Deskripcija</p>
            <p className='text-muted-foreground'>{productData.description}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='font-medium'>Kategorijas</p>
            <div className='flex gap-2 flex-wrap'>
              {productData.category.map((category) => (
                <span
                  key={category}
                  className=' py-1 px-3 rounded-full bg-muted text-primary text-xs font-medium'
                >
                  {categoryMap[category].label}
                </span>
              ))}
            </div>
          </div>
          <SelectSeparator />
          <AddToCart id={productData.id} isFav={isFav || false} />
        </div>
      </div>
      <MoreInfo
        reviews={productData.reviews}
        details={productData.details}
        specifications={productData.specifications || null}
        preview={false}
        userReviewId={userReview}
      />
    </div>
  );
};
