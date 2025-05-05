'use client';
import { useTranslation } from 'react-i18next';
import { ConnectButton } from './connect-button';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { createLoginLink } from '../../../../../actions/stripe/create-login';
import { useToast } from '@/hooks/use-toast';

interface PaymentsFormsProps {
  stripeAccountId: string | null;
}
export const PaymentsForms = ({ stripeAccountId }: PaymentsFormsProps) => {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDashboard = () => {
    startTransition(() => {
      createLoginLink().then((res) => {
        if (res.url) {
          window.open(res.url, '_blank');
        } else {
          toast({
            title: t('error'),
            description: t(res.error || 'error'),
            variant: 'destructive',
          });
        }
      });
    });
  };

  return stripeAccountId ? (
    <div className='space-y-4'>
      <div className='flex items-center space-x-2 '>
        <CheckCircle className='h-5 w-5 text-green-500' />
        <p>{t('stripeConnected')}</p>
      </div>
      <Button variant='outline' onClick={handleDashboard} disabled={isPending}>
        {t('viewStripeDashboard')}
      </Button>
    </div>
  ) : (
    <ConnectButton />
  );
};
