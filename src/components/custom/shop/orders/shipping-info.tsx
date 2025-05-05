import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Truck } from 'lucide-react';

interface CustomerInfoProps {
  address: {
    street: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
  } | null;
  t: (value: string) => string;
}

export const ShippingInfo = ({ address, t }: CustomerInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center'>
          <Truck className='h-[17px] w-[17px]' />
          {t('shippingData')}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        <p className='text-sm font-semibold flex gap-2 items-center'>
          <MapPin className='h-[16px] w-[16px]' /> {t('address')}
        </p>
        <p className='text-muted-foreground text-sm'>
          {address?.street} {address?.postalCode}
        </p>
        <p className='text-muted-foreground text-sm'>{address?.city}</p>

        <p className='text-muted-foreground text-sm'>{address?.country}</p>
      </CardContent>
    </Card>
  );
};
