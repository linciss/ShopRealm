'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { requestVerification } from '../../../../../actions/user/verify-email';

export const VerifyEmailButton = () => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleRequestVerification = () => {
    startTransition(() => {
      requestVerification().then((res) => {
        if (res.error) {
          toast({
            variant: 'destructive',
            title: 'Kluda!',
            description: res.error,
          });
        } else {
          toast({
            title: 'Pieprasits!',
            description: res.success,
          });
        }
      });
    });
  };

  return (
    <Button disabled={isPending} onClick={handleRequestVerification}>
      Sutit verifikaciju
    </Button>
  );
};
