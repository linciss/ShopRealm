import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
        <h3 className='text-xl font-semibold flex gap-2 items-center'>
          <Truck />
          {t("shippingData")}
        </h3>
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        <p className='text-md font-semibold flex gap-2'>
          <MapPin /> {t("address")}
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
