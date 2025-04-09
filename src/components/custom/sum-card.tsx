'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format-currency';
import { redirect } from 'next/navigation';
import { Button } from '../ui/button';

interface SUmCardProps {
  subTotal: number;
  isCheckout?: boolean;
}

export const SumCard = ({ subTotal, isCheckout = false }: SUmCardProps) => {
  const handleCheckout = () => {
    // just a query param so i can show the price on the checkout page
    redirect(`/checkout?sum=${subTotal}`);
  };

  return (
    <Card className='flex-1 md:col-span-1 h-fit sticky top-20'>
      <CardHeader>
        <h4 className='text-xl font-semibold'>Sutijuma kopsavilkums</h4>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='text flex justify-between'>
          <p className='text-sm font-medium text-muted-foreground'>
            Starpsumma
          </p>
          <p className='text-sm font-medium'>{formatCurrency(subTotal)}</p>
        </div>
        <Separator />
        <div className='text flex justify-between'>
          <p className='text-md font-semibold'>Summa</p>
          <p className='text-md font-semibold'>{formatCurrency(subTotal)}</p>
        </div>
        {!isCheckout && (
          <Button className='w-full' onClick={handleCheckout}>
            Pasutit
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
