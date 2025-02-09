import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export const ProductCard = () => {
  return (
    <Card className='w-full max-w-xs p-5 cursor-pointer'>
      <Image
        priority
        src='https://i.imgur.com/MOZBqVS.jpg'
        width='400'
        height='250'
        alt='Product'
        className='aspect-[1.6] object-cover object-center'
      />
      <CardHeader className='p-4'>
        <CardTitle className='text-xl truncate'>
          Product Namesssssssssssss
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4'>
        <p className='text-base'>4 of 5</p>
        <p className='text-lg font-semibold'>$199.00</p>
      </CardContent>
    </Card>
  );
};
