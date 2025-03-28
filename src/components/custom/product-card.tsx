'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ReviewStars } from './review-stars';
import { calculateAverageRating } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart } from '../../../actions/add-item-to-cart';

interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  reviews: {
    rating: number;
  }[];
}

interface ProductGridProps {
  productData: Product;
}

export const ProductCard = ({ productData }: ProductGridProps) => {
  // const [favorite, setFavorite] = useState<boolean>(false);

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(() => {
      addItemToCart(productData.id).then((res) => {
        if (res.error) {
          toast({
            title: 'Kluda!',
            variant: 'destructive',
            description: res.error,
          });
        } else {
          toast({
            title: 'Pieveinots grozam!',
            description: res.success,
          });
        }
      });
    });
  };

  return (
    <Card className='overflow-hidden group'>
      <div className='aspect-square relative overflow-hidden '>
        <Link href={`/product/${productData.id}`}>
          <Image
            priority
            src='https://i.imgur.com/MOZBqVS.jpg'
            fill
            alt='Product'
            className='object-cover'
          />
        </Link>
        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity'>
          <div className='flex gap-2'>
            <Button
              className='flex-1'
              variant={'outline'}
              onClick={() => {
                handleAddToCart();
              }}
              disabled={isPending}
            >
              <ShoppingCart /> Pievienot grozam
            </Button>
            <Button variant={'outline'}>
              <Heart />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className='px-2 py-4'>
        <Link href={productData.id}>
          <p className='text-sm truncate'>{productData.name}</p>
          <div className='flex flex-row gap-2 items-center'>
            <ReviewStars
              averageReview={calculateAverageRating(productData.reviews)}
            />
            <p className='text-xs text-muted-foreground'>
              ({ReviewStars.length} atsauksmes)
            </p>
          </div>

          <p className='text-md font-semibold'>€ {productData.price}</p>
        </Link>
      </CardContent>
    </Card>
  );
};
