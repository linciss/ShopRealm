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
import { ProductCard } from '../product-card';
import { auth } from '../../../../auth';
import { formatCurrency } from './../../../lib/format-currency';

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
        sale: boolean;
        salePrice: string | null;
        store: {
          name: string;
          id: string;
        };
      }
    | undefined;
}

export const ProductPageInfo = async ({ productData }: ProductProps) => {
  if (!productData) return;

  const session = await auth();

  const isFav = await isItemFavorite(productData.id);
  const userReview = await getUserReview(productData.id);
  const relatedProducts = await getRelatedProducts(
    productData.category,
    productData.id,
  );

  return (
    <div className=' px-2 md:px-4 '>
      <div className='py-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products'>Produkti</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${productData.category[0]}`}>
                {categoryMap[productData.category[0]].label}
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
            className='w-auto h-[550px]  object-cover '
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
                prefetch={false}
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
      />

      <div className='mt-5'>
        <h3 className='text-2xl font-semibold'>Jums varetu ari patikt</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {relatedProducts?.map((prod) => (
            <ProductCard key={prod.id} productData={prod} session={session} />
          ))}
        </div>
      </div>
    </div>
  );
};
