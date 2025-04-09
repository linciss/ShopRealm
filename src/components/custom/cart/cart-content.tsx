'use client';

import { Button } from '@/components/ui/button';

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
    quantity: number;
  };
  quantity: number;
}

interface CartContentProps {
  session: Session | null;
  cart?: CartItem[] | null;
}

interface LocalCartItem {
  id: string;
  quantity: number;
}

// overcomplicated cart page because of allowing unsigned users :))))
export const CartContent = ({ session, cart }: CartContentProps) => {
  const [localCartProducts, setLocalCartProducts] = useState<LocalCartItem[]>(
    [],
  );
  const [cartProducts, setCartProducts] = useState<CartItem[]>(cart || []);

  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  //   Gets product data from backend when user is not logged in
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('addToCart');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      setLocalCartProducts(parsedCart);

      if (parsedCart.length > 0 && !session?.user.id) {
        startTransition(async () => {
          const productIds = parsedCart.map((item: LocalCartItem) => item.id);
          const res = await getLocalCartProducts(productIds);

          if (res.products) {
            const products = res.products;

            const productsWithQuantity = products.map((product) => {
              const cartItem = parsedCart.find(
                (item: LocalCartItem) => item.id === product.id,
              );
              return {
                product: product,
                quantity: cartItem?.quantity || 1,
              };
            });
            setCartProducts(productsWithQuantity);
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
    if (session?.user.id && localCartProducts.length > 0) {
      startTransition(() => {
        syncCart(localCartProducts).then((res) => {
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
            setLocalCartProducts([]);
            setCartProducts(res.cartItems || []);
          }
        });
      });
    }
  }, [session, localCartProducts, toast]);

  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // remove callback
  const handleCartRemove = (productId: string) => {
    if (!session?.user.id) {
      setLocalCartProducts((prev) =>
        prev.filter((item) => item.id !== productId),
      );

      setCartProducts((prev) =>
        prev.filter((product) => product.product.id !== productId),
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
          setCartProducts(res.cartItems || []);
        }
      });
    });
  };

  // quantity change callback
  const handleChangeQuantity = (productId: string, quantity: number) => {
    if (!session?.user.id) {
      const changedProduct = localCartProducts.find(
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

      setLocalCartProducts(cart);
      return;
    }

    setCartProducts((prevCartProducts) =>
      prevCartProducts.map((item) =>
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
    <div className='flex flex-col flex-[2] col-span-2 '>
      <div className='flex justify-between'>
        {session?.user.id
          ? cartProducts?.length || 0
          : localCartProducts.length}{' '}
        produkt
        {(session?.user ? cartProducts?.length : localCartProducts.length) !== 1
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
      ) : (
        <div className='space-y-4 mt-4'>
          {cartProducts?.map((item) => (
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
  );
};
