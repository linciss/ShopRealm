'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Session } from 'next-auth';
import { useEffect, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { syncCart } from '../../../../actions/cart/sync-local-cart';
import { getLocalCartProducts } from '../../../../actions/cart/get-local-cart-items';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: string;
    image: string | null;
  };
  quantity: number;
}

interface CartContentProps {
  session: Session | null;
  cartProducts?: CartItem[] | null;
}

interface LocalCartItem {
  id: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: string;
  image: string | null;
}

export const CartContent = ({ session, cartProducts }: CartContentProps) => {
  const [localCartItems, setLocalCartItems] = useState<LocalCartItem[]>([]);
  const [localProductDetails, setLocalProductDetails] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  //   Gets product data from backend when user is not logged in
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('addToCart');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      setLocalCartItems(parsedCart);

      if (parsedCart.length > 0 && !session?.user.id) {
        startTransition(async () => {
          const productIds = parsedCart.map((item: LocalCartItem) => item.id);
          const res = await getLocalCartProducts(productIds);

          if (res.products) {
            setLocalProductDetails(res.products);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Kluda:', error);
      setIsLoading(false);
    }
  }, [session]);

  //   syncs localstroage cart with server and database cart
  useEffect(() => {
    if (session?.user.id && localCartItems.length > 0) {
      startTransition(async () => {
        const res = await syncCart(localCartItems);

        if (res.success) {
          toast({
            title: 'Grozs sinhronizets!',
            description:
              'Jusu lokalais grozs tika sinhronizets ar server grozu',
          });

          localStorage.setItem('addToCart', '[]');
          setLocalCartItems([]);
        } else if (res.error) {
          toast({
            title: 'Kluda!',
            description: res.error,
            variant: 'destructive',
          });
        }
      });
    }
  }, [session, localCartItems, toast]);

  return (
    <div className='mt-5 w-full flex flex-col  gap-6 md:flex-row'>
      <div className='flex flex-col flex-[2] '>
        <div className='flex justify-between'>
          {session?.user.id ? cartProducts?.length || 0 : localCartItems.length}{' '}
          produkt
          {(session?.user ? cartProducts?.length : localCartItems.length) !== 1
            ? 'i'
            : 's'}
          <Button variant={'outline'} disabled={isPending || isLoading}>
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Apstrada...
              </>
            ) : (
              <>
                <RefreshCcw className='mr-2' /> Iztirit
              </>
            )}
          </Button>
        </div>
        {isLoading ? (
          <div className='py-12 flex justify-center items-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <span className='ml-2 text-muted-foreground'>Ielādē grozu...</span>
          </div>
        ) : !session?.user.id ? (
          localProductDetails.map((item) => <div key={item.id}>{item.id}</div>)
        ) : (
          cartProducts?.map((item) => (
            <div key={item.product.id}>
              {item.product.id} {item.quantity}
            </div>
          ))
        )}
      </div>
      <Card className='flex-1'>
        <CardHeader>
          <h4 className='text-xl font-semibold'>Sutijuma kopsavilkums</h4>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text flex justify-between'>
            <p className='text-sm font-medium text-muted-foreground'>
              Starpsumma
            </p>
            <p className='text-sm font-medium'>$569.23</p>
          </div>
          <div className='text flex justify-between'>
            <p className='text-sm font-medium text-muted-foreground'>
              Nosutisana
            </p>
            <p className='text-sm font-medium'>$569.23</p>
          </div>
          <div className='text flex justify-between'>
            <p className='text-sm font-medium text-muted-foreground'>
              Nodoklis (21%)
            </p>
            <p className='text-sm font-medium'>$569.23</p>
          </div>
          <Separator />
          <div className='text flex justify-between'>
            <p className='text-md font-semibold'>Summa</p>
            <p className='text-md font-semibold'>$569.23</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
