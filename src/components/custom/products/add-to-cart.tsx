'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Minus, Plus, Share2Icon, ShoppingCartIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { addItemToCart } from '../../../../actions/cart/add-item-to-cart';
import { addItemToFavorites } from '../../../../actions/cart/add-item-to-favorites';

interface AddToCartProps {
  id: string;
  isFav: boolean;
}

export const AddToCart = ({ id, isFav }: AddToCartProps) => {
  const [quantity, setQuantity] = useState<number>(0);
  const url = typeof window !== 'undefined' ? window.location.href : null;

  const [favorite, setFavorite] = useState<boolean>(isFav);

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(() => {
      addItemToCart(id, quantity).then((res) => {
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
      addItemToFavorites(id).then((res) => {
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
    <div className='flex flex-col gap-4'>
      <div className='flex-row flex gap-2'>
        <div className='flex items-center border rounded-md'>
          <Button
            variant={'ghost'}
            onClick={() => {
              setQuantity(quantity - 1);
            }}
            disabled={quantity === 0}
          >
            <Minus />
          </Button>
          <div className='w-12 text-center'>{quantity}</div>
          <Button
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
          onClick={() => {
            handleAddToCart();
          }}
          disabled={isPending}
        >
          <ShoppingCartIcon /> Pievienot grozam
        </Button>
      </div>
      <div className='flex flex-row gap-2'>
        <Button
          className='flex-1'
          variant={'outline'}
          onClick={() => {
            handleAddToFavorites();
          }}
        >
          {favorite ? <Heart fill={'#ff0000'} stroke={'#ff0000'} /> : <Heart />}
          {!favorite ? 'Pievienot pie favortiem' : 'Nonemt no favoritiem'}
        </Button>
        <Button
          variant={'outline'}
          onClick={() => {
            // LATER ADD SHARES????
            navigator.clipboard.writeText(url || '');
            toast({
              title: 'Veiksmigi nokopeta saite uz produktu!',
            });
          }}
        >
          <Share2Icon />
        </Button>
      </div>
    </div>
  );
};
