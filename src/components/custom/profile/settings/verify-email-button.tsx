'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { requestVerification } from '../../../../../actions/user/verify-email';
import { useTranslation } from 'react-i18next';

export const VerifyEmailButton = () => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleRequestVerification = () => {
    startTransition(() => {
      requestVerification().then((res) => {
        if (res.error) {
          toast({
            variant: 'destructive',
            title: t('error'),
            description: t(res.error),
          });
        } else {
          toast({
            title: t('success'),
            description: `${t('sentTo')}: ${res.email}`,
          });
        }
      });
    });
  };

  return (
    <Button disabled={isPending} onClick={handleRequestVerification}>
      {t('sendVerification')}
    </Button>
  );
};
