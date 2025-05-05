'use client';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { createConnectAccount } from '../../../../../actions/stripe/create-connect-account';

export const ConnectButton = () => {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const handleConnect = () => {
    startTransition(() => {
      createConnectAccount().then((res) => {
        if (res.url) {
          window.location.href = res.url;
        } else {
          console.error(res.error);
        }
      });
    });
  };

  return (
    <Button onClick={handleConnect} disabled={isPending}>
      {t('connectWithStripe')}
    </Button>
  );
};
