import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface InventoryStatusProps {
  attentionItems: {
    id: string;
    name: string;
    image: string | null;
    quantity: number;
  }[];
  t: (value: string) => string;
}
export const InventoryStatus = ({
  attentionItems,
  t,
}: InventoryStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('inventoryStatus')}</CardTitle>
        <CardDescription>{t('inventoryStatusDesc')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {attentionItems?.length > 0 ? (
          attentionItems.map((product) => {
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
                      alt='Attention product image'
                    />
                  </div>

                  <div>
                    <p>{product.name}</p>
                    {product.quantity > 0 ? (
                      <p className='text-orange-800 text-sm'>
                        {t('leftInStock')}: {product.quantity}
                      </p>
                    ) : (
                      <p className='text-red-800 text-sm'>{t('outOfStock')}</p>
                    )}
                  </div>
                </div>
                <Link href={`/store/products/configurator/${product.id}`}>
                  <Button variant={'outline'}>{t('update')}</Button>
                </Link>
              </div>
            );
          })
        ) : (
          <p className='text-muted-foreground'>{t('noInventoryStatus')}</p>
        )}
      </CardContent>
    </Card>
  );
};
