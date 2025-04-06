'use client';

import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { createCheckoutSession } from '../../../../actions/stripe/create-session';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const CheckoutButton = () => {
  const [isPending, startTransition] = useTransition();
  const redirectUrl =
    typeof window !== 'undefined' ? window.location.origin : null;

  const { toast } = useToast();

  const handleCheckout = () => {
    startTransition(() => {
      createCheckoutSession(redirectUrl || '').then((res) => {
        if (res.url) {
          window.location.href = res.url;
        } else {
          toast({
            title: 'Kluda!',
            description: res.error,
            variant: 'destructive',
          });
        }
      });
    });
  };

  return (
    <Button
      className='w-full'
      onClick={() => {
        handleCheckout();
      }}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Apstrada...
        </>
      ) : (
        'Pasutit'
      )}
    </Button>
  );
};
