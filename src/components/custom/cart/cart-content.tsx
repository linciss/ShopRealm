'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Session } from 'next-auth';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { syncCart } from '../../../../actions/cart/sync-local-cart';
import { getLocalCartProducts } from '../../../../actions/cart/get-local-cart-items';
import { CartItem } from './cart-item';
import { changeItemQuantity } from '../../../../actions/cart/change-item-quantity';
import { removeItem } from '../../../../actions/cart/remove-item';

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
  const [cartItems, setCartItems] = useState<CartItem[]>(cartProducts || []);

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
      startTransition(() => {
        syncCart(localCartItems).then((res) => {
          if (res.error) {
            toast({
              title: 'Kluda!',
              description: res.error,
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Grozs sinhronizets!',
              description:
                'Jusu lokalais grozs tika sinhronizets ar server grozu',
            });

            localStorage.setItem('addToCart', '[]');
            setLocalCartItems([]);
            setCartItems(res.cartItems || []);
          }
        });
      });
    }
  }, [session, localCartItems, toast]);

  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // remove callback
  const handleCartRemove = (productId: string) => {
    if (!session?.user.id) {
      setLocalCartItems((prev) => prev.filter((item) => item.id !== productId));

      setLocalProductDetails((prev) =>
        prev.filter((product) => product.id !== productId),
      );
      return;
    }

    startTransition(() => {
      removeItem(productId).then((res) => {
        if (res.error) {
          toast({
            title: 'Kluda!',
            description: res.error,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Veiksmigi izdzests no groza!',
            description: res.success,
          });
          setCartItems(res.cartItems || []);
        }
      });
    });
  };

  // quantity change callback
  const handleChangeQuantity = (productId: string, quantity: number) => {
    if (!session?.user.id) {
      const changedProduct = localCartItems.find(
        (item) => item.id === productId,
      );
      if (!changedProduct) {
        return;
      }

      changedProduct.quantity = quantity;

      const savedCart = localStorage.getItem('addToCart');
      const cart = savedCart ? JSON.parse(savedCart) : [];

      const cartItem = cart.find(
        (item: LocalCartItem) => item.id === productId,
      );

      if (cartItem) {
        cartItem.quantity = quantity > 0 ? quantity : 1;
      } else {
        cart.push({ id: productId, quantity: quantity > 0 ? quantity : 1 });
      }

      localStorage.setItem('addToCart', JSON.stringify(cart));

      setLocalCartItems(cart);
      return;
    }

    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: quantity } : item,
      ),
    );

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      startTransition(() => {
        changeItemQuantity(productId, quantity).then((res) => {
          if (res.error) {
            toast({
              title: 'Kļūda!',
              description: res.error,
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Samainits!',
              description: res.success,
            });
          }
        });
      });
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className='mt-5 w-full grid grid-cols-1 md:grid-cols-3  gap-6 md:flex-row'>
      <div className='flex flex-col flex-[2] col-span-2 '>
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
          <div className='space-y-4 mt-4'>
            {localProductDetails.map((item) => (
              <div key={item.id}>
                <CartItem
                  item={{
                    product: item,
                    quantity: localCartItems.find(
                      (cartItem) => cartItem.id === item.id,
                    )?.quantity,
                  }}
                  onRemove={handleCartRemove}
                  onChange={handleChangeQuantity}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className='space-y-4 mt-4'>
            {cartItems?.map((item) => (
              <div key={item.product.id}>
                <CartItem
                  item={item}
                  session={session}
                  onChange={handleChangeQuantity}
                  onRemove={handleCartRemove}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Card className='flex-1 md:col-span-1 h-fit'>
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
