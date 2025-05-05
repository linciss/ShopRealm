import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Box } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '../../lib/format-currency';

interface OrderInfoProps {
  image: string | null;
  name: string;
  priceAtOrder: number;
  quantity: number;
  total: number;
  t: (value: string) => string;
}

export const OrderInfo = ({
  image,
  name,
  priceAtOrder,
  quantity,
  total,
  t,
}: OrderInfoProps) => {
  return (
    <Card className=''>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center'>
          <Box /> {t('orderProduct')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex md:flex-row flex-col items-center'>
          <div className='relative p-2'>
            <Image
              src={image || ''}
              alt='product image'
              width={100}
              height={100}
              className='md:w-[100px] w-full object-contain h-[200px] md:h-[100px]'
            />
          </div>
          <div className='flex-1 md:text-start text-center'>
            <p className='text-lg font-semibold'>{name}</p>
            <p className='text-xs text-muted-foreground'>
              {formatCurrency(priceAtOrder)} x {quantity}
            </p>
          </div>
          <div>
            <p className='text-lg font-semibold'>{formatCurrency(total)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
