import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/format-currency';
import Image from 'next/image';

interface TopProductsProps {
  topProducts: {
    id: string;
    name: string;
    image: string | null;
    price: string;
    sold: number;
  }[];
  t: (value: string) => string;
}

export const TopProducts = ({ topProducts, t }: TopProductsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('topProducts')}</CardTitle>
        <CardDescription>{t('topProductsDesc')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {topProducts.length > 0 ? (
          topProducts.map((product) => {
            return (
              <div
                key={product.id}
                className='flex flex-row items-center justify-between'
              >
                <div className='flex flex-row items-center'>
                  <div>
                    <Image
                      src={product.image || ''}
                      height={20}
                      width={40}
                      alt='Top product image'
                    />
                  </div>

                  <div>
                    <p>{product.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {t('price')} {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
                <p className='text-sm'>
                  {product.sold} {t('sold')}
                </p>
              </div>
            );
          })
        ) : (
          <p className='text-muted-foreground'>{t('noTopProducts')}</p>
        )}
      </CardContent>
    </Card>
  );
};
