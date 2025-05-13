'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Minus, Plus, Share2Icon, ShoppingCartIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { addItemToCart } from '../../../../actions/cart/add-item-to-cart';
import { addItemToFavorites } from '../../../../actions/cart/add-item-to-favorites';
import { Session } from 'next-auth';
import { useTranslation } from 'react-i18next';

interface AddToCartProps {
  id: string;
  isFav: boolean;
  session: Session | null;
  maxQuantity?: number;
}

interface CartItem {
  id: string;
  quantity: number;
}

export const AddToCart = ({
  id,
  isFav,
  session,
  maxQuantity,
}: AddToCartProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const url = typeof window !== 'undefined' ? window.location.href : null;

  const [favorite, setFavorite] = useState<boolean>(isFav);

  const { toast } = useToast();
  const { t } = useTranslation();
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

      const cartItem = cart.find((item: CartItem) => item.id === id);

      if (cartItem) {
        cartItem.quantity += quantity > 0 ? quantity : 1;
      } else {
        cart.push({ id, quantity: quantity > 0 ? quantity : 1 });
      }

      localStorage.setItem('addToCart', JSON.stringify(cart));

      toast({
        title: t('success'),
        description: t('addedToCartLocally'),
      });

      return;
    }

    if (quantity < 1) {
      return toast({
        title: t('error'),
        variant: 'destructive',
        description: t('1item'),
      });
    }

    startTransition(() => {
      addItemToCart(id, quantity).then((res) => {
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
      addItemToFavorites(id).then((res) => {
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
    <div className='flex flex-col gap-4'>
      <div className='flex-row flex gap-2'>
        <div className='flex items-center border rounded-md'>
          <Button
            variant={'ghost'}
            onClick={() => {
              setQuantity(quantity - 1);
            }}
            disabled={quantity === 1}
            aria-label='Decrease quantity'
          >
            <Minus />
          </Button>
          <div className='w-12 text-center'>{quantity}</div>
          <Button
            aria-label='Increase quantity'
            disabled={quantity === maxQuantity}
            variant={'ghost'}
            onClick={() => {
              setQuantity(quantity + 1);
            }}
          >
            <Plus />
          </Button>
        </div>
        <Button
          className='flex-1'
          aria-label='Add to cart'
          onClick={() => {
            handleAddToCart();
          }}
          disabled={isPending}
        >
          <ShoppingCartIcon /> {t('atc')}
        </Button>
      </div>
      <div className='flex flex-row gap-2'>
        <Button
          className='flex-1'
          variant={'outline'}
          aria-label='Add to favorites'
          onClick={() => {
            handleAddToFavorites();
          }}
        >
          {favorite ? <Heart fill={'#ff0000'} stroke={'#ff0000'} /> : <Heart />}
          {!favorite ? t('atf') : t('rtf')}
        </Button>
        <Button
          variant={'outline'}
          aria-label='Share product'
          onClick={() => {
            // LATER ADD SHARES????
            navigator.clipboard.writeText(url || '');
            toast({
              title: t('copied'),
            });
          }}
        >
          <Share2Icon />
        </Button>
      </div>
    </div>
  );
};
