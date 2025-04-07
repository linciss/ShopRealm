import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Box } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from './../../../../lib/format-currency';

interface OrderInfoProps {
  order: {
    id: string;
    quantity: number;
    priceAtOrder: number;
    status: string;
    total: number;
    product: {
      name: string;
      image: string | null;
    };
    order: {
      user: {
        name: string;
        email: string;
        phone: string | null;
        address: {
          street: string | null;
          city: string | null;
          country: string | null;
          postalCode: string | null;
        } | null;
      };
      createdAt: Date;
      paymentStatus: string;
    };
  };
}
export const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <Card className=''>
      <CardHeader>
        <h2 className='text-xl font-semibold flex gap-2'>
          <Box /> Pasutijuma produkts
        </h2>
      </CardHeader>
      <CardContent>
        <div className='flex md:flex-row flex-col items-center'>
          <div className='relative p-2'>
            <Image
              src={order.product.image || ''}
              alt='product image'
              width={100}
              height={100}
              className='md:w-[100px] w-full object-contain h-[200px] md:h-[100px]'
            />
          </div>
          <div className='flex-1 md:text-start text-center'>
            <p className='text-lg font-semibold'>{order.product.name}</p>
            <p className='text-xs text-muted-foreground'>
              {formatCurrency(order.priceAtOrder)} x {order.quantity}
            </p>
          </div>
          <div>
            <p className='text-lg font-semibold'>
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
