'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Minus, Plus, Share2Icon, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';

export const AddToCart = () => {
  const [quantity, setQuantity] = useState<number>(0);
  const url = typeof window !== 'undefined' ? window.location.href : null;

  const { toast } = useToast();

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex-row flex gap-2'>
        <div className='flex items-center border rounded-md'>
          <Button
            aria-label='Reduce item amount by 1'
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
            aria-label='Add item amount by 1'
          >
            <Plus />
          </Button>
        </div>
        <Button className='flex-1'>
          <ShoppingCartIcon /> Pievienot grozam
        </Button>
      </div>
      <div className='flex flex-row gap-2'>
        <Button className='flex-1' variant={'outline'}>
          <Heart /> Pievienot pie favortiem
        </Button>
        <Button
          aria-label='Product link'
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
