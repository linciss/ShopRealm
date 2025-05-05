'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface StorePaymentSetupBannerProps {
  isStripeConnected: boolean;
  storeName: string;
}

export function StorePaymentSetupBanner({
  isStripeConnected,
  storeName,
}: StorePaymentSetupBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const { t } = useTranslation();

  if (isStripeConnected || isDismissed) return null;

  return (
    <div
      className={
        'relative px-4 py-4 rounded-lg mb-6 animate-in fade-in duration-300 border border-l-4 border-primary/30 dark:border-primary/20 border-l-primary bg-primary/5 dark:bg-primary/10'
      }
    >
      <div className='flex flex-col md:flex-row md:items-center gap-4'>
        <div className='flex items-start gap-3 flex-1'>
          <div className='flex-shrink-0 pt-0.5'>
            <div className='h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center'>
              <CreditCard className='h-5 w-5 text-primary' />
            </div>
          </div>
          <div className='flex-1 space-y-1'>
            <h3 className='font-medium text-base'>{t('setupPayments')}</h3>
            <p className='text-sm text-muted-foreground'>
              {t('connectYour')}
              {storeName}.{t('yourStoreIsReady')}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3 ml-0 md:ml-6'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsDismissed(true)}
            className='text-muted-foreground'
          >
            {t('remindMeLater')}
          </Button>
          <Button asChild size='sm' className='gap-1.5'>
            <Link href='/store/settings?tab=payment'>
              {t('setupPayments')}
              <ArrowRight className='h-3.5 w-3.5' />
            </Link>
          </Button>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className='absolute top-3 right-3 text-muted-foreground hover:text-foreground'
          aria-label='Dismiss'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
