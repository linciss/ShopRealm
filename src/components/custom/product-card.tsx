'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ReviewStars } from './review-stars';
import { calculateAverageRating } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
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
}

export const ProductCard = ({
  productData,
  favoriteItems,
  session,
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
        cart.push({ id: productData.id, quantity: 1 });
      }

      localStorage.setItem('addToCart', JSON.stringify(cart));

      toast({
        title: t('addedToCart'),
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
            title: t('addedToCart'),
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
    <Card className='overflow-hidden group'>
      <div className='aspect-square relative overflow-hidden '>
        <Link
          href={productData.quantity > 0 ? `/products/${productData.id}` : ''}
          prefetch={false}
        >
          <Image
            src={productData.image || ''}
            fill
            loading='lazy'
            alt='Product'
            className='object-cover transition-transform group-hover:scale-105'
            sizes='(max-width: 368px) (max-height: 368px)'
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
          href={productData.quantity > 0 ? `/products/${productData.id}` : ''}
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
              <p className='text-md font-semibold text-red-500'>
                {formatCurrency(productData.price)}
              </p>
            </div>
          )}
        </Link>
      </CardContent>
    </Card>
  );
};
