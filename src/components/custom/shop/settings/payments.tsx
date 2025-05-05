import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
          <CardTitle className='flex gap-2 items-center'>
            <CreditCard className='h-[17px] w[[17px]' />
            {t('paymentSettings')}
          </CardTitle>
          <CardDescription>{t('paymentSettingsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentsForms stripeAccountId={stripeAccountId} />
        </CardContent>
      </Card>
    </div>
  );
};
