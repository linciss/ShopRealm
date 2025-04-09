import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format-currency';
import { Button } from '../ui/button';
import Link from 'next/link';

interface SUmCardProps {
  subTotal: number;
  isCheckout?: boolean;
}

export const SumCard = ({ subTotal, isCheckout = false }: SUmCardProps) => {
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
          <Link href={`/checkout?sum=${subTotal}`} prefetch={true}>
            <Button className='w-full'>Pasutit</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};
