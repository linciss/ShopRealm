import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { PaymentsForms } from './payments-forms';

interface PaymentsProps {
  t: (value: string) => string;
  stripeAccountId: string | null;
}

export const Payments = ({ t, stripeAccountId }: PaymentsProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className='flex flex-col gap-2'>
            <h2 className='font-semibold flex flex-row gap-3 items-center text-2xl'>
              <CreditCard />
              {t('paymentSettings')}
            </h2>
            <p className='text-sm font-normal text-muted-foreground'>
              {t('paymentSettingsDesc')}
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentsForms stripeAccountId={stripeAccountId} />
        </CardContent>
      </Card>
    </div>
  );
};
