'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ReviewStars } from './review-stars';
import { calculateAverageRating } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart } from '../../../actions/cart/add-item-to-cart';
import { addItemToFavorites } from '../../../actions/cart/add-item-to-favorites';
import { Session } from 'next-auth';
import { formatCurrency } from './../../lib/format-currency';
import { useTranslation } from 'react-i18next';

interface Product {
  id: string;
  name: string;
  image: string | null;
  price: string;
  slug?: string;
  reviews: {
    rating: number;
  }[];
  quantity: number;
  sale: boolean;
  salePrice: string | null;
  featured: boolean;
}

interface CartItem {
  id: string;
  quantity: number;
}

interface Favorite {
  productId: string;
}

interface ProductCardProps {
  productData: Product;
  favoriteItems?: Favorite[] | undefined;
  session?: Session | null;
  origin?: string;
  isPriority?: boolean;
}

export const ProductCard = ({
  productData,
  favoriteItems,
  session,
  origin,
  isPriority = false,
}: ProductCardProps) => {
  // checks if item is favorite

  const isFav =
    favoriteItems?.some((fav) => fav.productId === productData.id) || false;

  const [favorite, setFavorite] = useState<boolean>(isFav);
  const { t } = useTranslation();

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    if (!session?.user.id) {
      let cart = [];
      try {
        const savedCart = localStorage.getItem('addToCart');
        cart = savedCart ? JSON.parse(savedCart) : [];
      } catch (e) {
        console.error('KludA!', e);
        cart = [];
      }

      const cartItem = cart.find(
        (item: CartItem) => item.id === productData.id,
      );

      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        cart.push({
          id: productData.id,
          quantity: 1,
          price: productData.price,
        });
      }

      localStorage.setItem('addToCart', JSON.stringify(cart));

      toast({
        title: t('success'),
        description: t('addedToCartLocally'),
      });

      return;
    }

    startTransition(() => {
      addItemToCart(productData.id).then((res) => {
        if (res.error) {
          toast({
            title: t('error'),
            variant: 'destructive',
            description: t(res.error),
          });
        } else {
          toast({
            title: t('success'),
            description: t(res.success || t('addedToCart')),
          });
        }
      });
    });
  };

  const handleAddToFavorites = async () => {
    startTransition(() => {
      addItemToFavorites(productData.id).then((res) => {
        if (res.error) {
          toast({
            title: t('error'),
            variant: 'destructive',
            description: t(res.error),
          });
        } else if (res.success) {
          toast({
            title: t('success'),
            description: t(res.success),
          });
          setFavorite(true);
        } else {
          toast({
            title: t('success'),
            description: t(res.success1 || t('removedFromFav')),
          });
          setFavorite(false);
        }
      });
    });
  };

  return (
    <Card
      className={`overflow-hidden group ${productData.featured ? 'border-[#f59e0b] ' : ''}`}
    >
      <div className='aspect-square relative overflow-hidden '>
        <Link
          href={
            productData.quantity > 0
              ? origin
                ? `/products/${productData.slug}?origin=${origin}`
                : `/products/${productData.slug}`
              : ''
          }
          prefetch={false}
        >
          {productData.featured && (
            <div className=' tracking-tight items-center absolute top-2 left-2 bg-amber-100 border border-[#f59e0b] text-amber-800 px-2 py-1 rounded-full z-20 text-xs flex flex-row gap-1'>
              <Star fill='#f59e0b' className='h-3 w-3' strokeWidth={0} />
              {t('featured')}
            </div>
          )}
          <Image
            src={productData.image || ''}
            fill
            alt={productData.name}
            loading={isPriority ? 'eager' : 'lazy'}
            className='object-contain transition-transform group-hover:scale-105'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
            placeholder='blur'
            blurDataURL='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg=='
          />
        </Link>
        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity'>
          <div className='flex gap-2'>
            {productData.quantity > 0 && (
              <>
                <Button
                  className='flex-1'
                  variant={'outline'}
                  aria-label='Add to cart button'
                  onClick={() => {
                    handleAddToCart();
                  }}
                  disabled={isPending}
                >
                  <ShoppingCart /> {t('atc')}
                </Button>
              </>
            )}
            {session?.user.id && (
              <Button
                variant={'outline'}
                aria-label='Add to favorites button'
                onClick={() => {
                  handleAddToFavorites();
                }}
                disabled={isPending}
                className={productData.quantity <= 0 ? 'flex-1' : undefined}
              >
                {favorite ? (
                  <Heart fill={'#ff0000'} stroke={'#ff0000'} />
                ) : (
                  <Heart />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <CardContent className='px-2 py-4'>
        <Link
          href={
            productData.quantity > 0
              ? origin
                ? `/products/${productData.slug}?origin=${origin}`
                : `/products/${productData.slug}`
              : ''
          }
          prefetch={false}
        >
          <p className='text-sm truncate'>{productData.name}</p>
          <div className='flex flex-row gap-2 items-center'>
            <ReviewStars
              averageReview={calculateAverageRating(productData.reviews)}
            />
            <p className='text-xs text-muted-foreground'>
              ({productData.reviews.length})
            </p>
          </div>

          {!productData.sale ? (
            <p className='text-md font-semibold'>
              {formatCurrency(productData.price)}
            </p>
          ) : (
            <div className='inline-flex gap-2 items-center'>
              <p className='text-sm text-muted-foreground line-through '>
                {formatCurrency(productData.price)}
              </p>
              <p className='text-md font-semibold text-red-800'>
                {formatCurrency(productData.salePrice)}
              </p>
            </div>
          )}
        </Link>
      </CardContent>
    </Card>
  );
};
