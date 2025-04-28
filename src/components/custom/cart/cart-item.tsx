'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Session } from 'next-auth';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from './../../../lib/format-currency';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string | null;
  quantity: number;
  sale: boolean;
  salePrice: string | null;
}

interface CartItem {
  product: Product;
  quantity?: number;
}
interface CartItemProps {
  item: CartItem;
  session?: Session | null;
  onRemove?: (productId: string) => void;
  onChange: (productId: string, quantity: number) => void;
}

interface CartItemLocal {
  id: string;
  quantity: number;
}

export const CartItem = ({
  item,
  session,
  onRemove,
  onChange,
}: CartItemProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const [quantity, setQuantity] = useState<number>(item.quantity || 0);

  const handleItemRemove = () => {
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
        (cartItem: CartItemLocal) => cartItem.id === item.product.id,
      );

      if (cartItem) {
        cart.splice(cart.indexOf(cartItem), 1);
      } else {
        toast({
          title: t('error'),
          description: t('cantRemove'),
          variant: 'destructive',
        });
        return;
      }

      localStorage.setItem('addToCart', JSON.stringify(cart));

      toast({
        title: t('success'),
        description: t('removed'),
      });
    }

    if (onRemove) {
      onRemove(item.product.id);
    }
  };

  return (
    <Card key={item.product.id} className='overflow-hidden p-2'>
      <div className='flex flex-col md:flex-row '>
        <div className='relative p-2'>
          <Image
            src={item.product.image || ''}
            alt='product image'
            width={100}
            height={100}
            className='md:w-[100px] w-full object-contain h-[200px] md:h-[100px]'
          />
        </div>
        <div className='flex flex-col justify-between w-full'>
          <div className='space-y-2 flex flex-row justify-between px-2'>
            <div className='space-y-2'>
              <h3 className='font-semibold text-xl'>{item.product.name}</h3>
              <p className='text-muted-foreground text-sm'>
                {item.product.sale ? (
                  <>
                    <span className='line-through text-sm text-muted-foreground'>
                      {formatCurrency(item.product.price)}
                    </span>{' '}
                    <span className='text-red-500'>
                      {formatCurrency(item.product.salePrice)}
                    </span>
                  </>
                ) : (
                  formatCurrency(item.product.price)
                )}{' '}
                {t('perItem')}
              </p>
            </div>
            <div className='flex items-center border rounded-md h-9'>
              <Button
                variant={'ghost'}
                onClick={() => {
                  setQuantity(quantity - 1);
                  onChange(item.product.id, quantity - 1);
                }}
                disabled={quantity === 1}
              >
                <Minus />
              </Button>
              <div className='w-6 text-center'>{quantity}</div>
              <Button
                variant={'ghost'}
                onClick={() => {
                  setQuantity(quantity + 1);
                  onChange(item.product.id, quantity + 1);
                }}
                disabled={quantity === item.product.quantity}
              >
                <Plus />
              </Button>
            </div>
          </div>
          <Button
            variant={'ghost'}
            className='  text-red-500 border-red-500 hover:text-red-500 hover:border-red-500'
            onClick={() => {
              handleItemRemove();
            }}
          >
            <Trash2 /> {t('remove')}
          </Button>
        </div>
      </div>
    </Card>
  );
};
