import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/format-currency';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TopProductsProps {
  t: (value: string) => string;
  topSelling: {
    id: string;
    name: string;
    image: string | null;
    price: string;
    sold: number;
    views: number;
    convRate: number;
    revenue: number;
  }[];
}

export const TopProducts = ({ t, topSelling }: TopProductsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('topProducts')}</CardTitle>
        <CardDescription>{t('topProductsDesc')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className='sm:table-cell hidden'>
                {t('image')}
              </TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead className='sm:table-cell hidden'>
                {t('price')}
              </TableHead>
              <TableHead className='sm:table-cell hidden'>
                {t('unitsSold')}
              </TableHead>
              <TableHead>{t('revenue')}</TableHead>
              <TableHead className=''>{t('views')}</TableHead>
              <TableHead>{t('convRate')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topSelling.length > 0 ? (
              topSelling.map((product, idx) => {
                return (
                  <TableRow key={product.id} className=''>
                    <TableCell className=''>{idx + 1}</TableCell>
                    <TableCell className='sm:table-cell hidden'>
                      <Image
                        src={product.image || ''}
                        height={20}
                        width={40}
                        alt='Top product image'
                      />
                    </TableCell>
                    <TableCell className=''>{product.name}</TableCell>
                    <TableCell className='sm:table-cell hidden'>
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className='sm:table-cell hidden'>
                      {product.sold}
                    </TableCell>
                    <TableCell className=''>
                      {formatCurrency(product.revenue)}
                    </TableCell>
                    <TableCell className=''>{product.views}</TableCell>
                    <TableCell className=''>{`${parseFloat(product.convRate.toFixed(2))}%`}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell>
                  <p className='text-muted-foreground'>{t('noTopProducts')}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
