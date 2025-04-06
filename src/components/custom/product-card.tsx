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

interface Product {
  id: string;
  name: string;
  image: string | null;
  price: string;
  slug: string;
  reviews: {
    rating: number;
  }[];
}

interface CartItem {
  id: string;
  quantity: number;
}

interface Favorite {
  id: string;
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
        title: 'Pievienots grozam!',
        description: 'Pievienots grozam lokali!',
      });

      return;
    }

    startTransition(() => {
      addItemToCart(productData.id).then((res) => {
        if (res.error) {
          toast({
            title: 'Kluda!',
            variant: 'destructive',
            description: res.error,
          });
        } else {
          toast({
            title: 'Pieveinots grozam!',
            description: res.success,
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
            title: 'Kluda!',
            variant: 'destructive',
            description: res.error,
          });
        } else if (res.success) {
          toast({
            title: 'Pieveinots Pie favoritiem!',
            description: res.success,
          });
          setFavorite(true);
        } else {
          toast({
            title: 'Nonemts no favoritiem!',
            description: res.success1,
          });
          setFavorite(false);
        }
      });
    });
  };

  return (
    <Card className='overflow-hidden group'>
      <div className='aspect-square relative overflow-hidden '>
        <Link href={`/products/${productData.id}`}>
          <Image
            priority
            src={productData.image || ''}
            fill
            alt='Product'
            className='object-contain transition-transform group-hover:scale-105'
            sizes='(max-width: 368px) (max-height: 368px)'
          />
        </Link>
        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity'>
          <div className='flex gap-2'>
            <Button
              className='flex-1'
              variant={'outline'}
              onClick={() => {
                handleAddToCart();
              }}
              disabled={isPending}
            >
              <ShoppingCart /> Pievienot grozam
            </Button>
            <Button
              variant={'outline'}
              onClick={() => {
                handleAddToFavorites();
              }}
              disabled={isPending}
            >
              {favorite ? (
                <Heart fill={'#ff0000'} stroke={'#ff0000'} />
              ) : (
                <Heart />
              )}
            </Button>
          </div>
        </div>
      </div>

      <CardContent className='px-2 py-4'>
        <Link href={`/products/${productData.id}`}>
          <p className='text-sm truncate'>{productData.name}</p>
          <div className='flex flex-row gap-2 items-center'>
            <ReviewStars
              averageReview={calculateAverageRating(productData.reviews)}
            />
            <p className='text-xs text-muted-foreground'>
              ({productData.reviews.length})
            </p>
          </div>

          <p className='text-md font-semibold'>€ {productData.price}</p>
        </Link>
      </CardContent>
    </Card>
  );
};
