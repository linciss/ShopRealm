import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format-currency';
import { Button } from '../ui/button';
import Link from 'next/link';
import { RotateCcw, Shield, Truck } from 'lucide-react';

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
    <div className='space-y-8 mt-5 '>
      <Card className='flex-1 md:col-span-1 h-fit '>
        <CardHeader>
          <CardTitle>{t('orderSummary')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text flex justify-between'>
            <p className='text-sm font-medium text-muted-foreground'>
              {t('subTotal')}
            </p>
            <p className='text-sm font-medium'>{formatCurrency(subTotal)}</p>
          </div>
          <div className='text flex justify-between'>
            <p className='text-sm font-medium text-muted-foreground'>
              {t('shipping')}
            </p>
            <p className='text-sm font-medium  line-through '>
              {formatCurrency(0)}
            </p>
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
                className={`w-full ${!canProceed ? 'cursor-not-allowed pointer-events-none' : ''}`}
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

      <div className='bg-muted/50 rounded-lg p-4 space-y-3'>
        <div className='flex items-center gap-2'>
          <Truck className='h-5 w-5 text-muted-foreground' />
          <div>
            <p className='font-medium'>{t('freeShipping')}</p>
            <p className='text-sm text-muted-foreground'>
              {t('freeShippingDesc')}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <RotateCcw className='h-5 w-5 text-muted-foreground' />
          <div>
            <p className='font-medium'>{t('30dayReturns')}</p>
            <p className='text-sm text-muted-foreground'>
              {t('30dayReturnsDesc')}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Shield className='h-5 w-5 text-muted-foreground' />
          <div>
            <p className='font-medium'>{t('secureCheckout')}</p>
            <p className='text-sm text-muted-foreground'>
              {t('secureCheckoutDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
