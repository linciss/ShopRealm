import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format-currency';
import { Button } from '../ui/button';
import Link from 'next/link';

interface SumCardProps {
  subTotal: number;
  isCheckout?: boolean;
  t: (value: string) => string;
  canProceed?: boolean;
  isGuest?: boolean;
}

export const SumCard = ({
  subTotal,
  isCheckout = false,
  t,
  canProceed = false,
  isGuest = true,
}: SumCardProps) => {
  if (isGuest && !isCheckout) {
    return (
      <Card className='flex-1 md:col-span-1 h-fit sticky top-20'>
        <CardHeader>
          <h4 className='text-xl font-semibold'>{t('orderSummary')}</h4>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button className='w-full' disabled={true}>
            {t('logInToCheckout')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='flex-1 md:col-span-1 h-fit sticky top-20'>
      <CardHeader>
        <h4 className='text-xl font-semibold'>{t('orderSummary')}</h4>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='text flex justify-between'>
          <p className='text-sm font-medium text-muted-foreground'>
            {t('subTotal')}
          </p>
          <p className='text-sm font-medium'>{formatCurrency(subTotal)}</p>
        </div>
        <Separator />
        <div className='text flex justify-between'>
          <p className='text-md font-semibold'>{t('total')}</p>
          <p className='text-md font-semibold'>{formatCurrency(subTotal)}</p>
        </div>
        {!isCheckout && (
          <>
            <Link
              href={`/checkout?sum=${subTotal}`}
              prefetch={true}
              className='w-full'
              aria-disabled={!canProceed}
            >
              <Button className='w-full mt-2' disabled={!canProceed}>
                {t('checkout')}
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
};
