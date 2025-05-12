import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisIcon, Eye, Pencil } from 'lucide-react';
import { DeleteButton } from './delete-button';
import { Separator } from '@/components/ui/separator';
import { Pagination } from './pagination';
import { TableSearch } from '../table-search';
import Image from 'next/image';
import { formatCurrency } from '@/lib/format-currency';
import { FeaturedButton } from './featured-button';

interface ProductsProps {
  products?:
    | {
        id: string;
        image: string | null;
        name: string;
        price: string;
        store: string;
        stock: number;
        createdAt: Date;
        active: boolean;
        sale: boolean;
        salePrice: string | null;
        featured: boolean;
      }[]
    | undefined;
  t: (value: string) => string;
  pageCount: number;
}

export const ProductsTable = async ({
  products,
  t,
  pageCount,
}: ProductsProps) => {
  return (
    <Card>
      <CardHeader className='sm:p-6 px-2 !pb-0'>
        <CardTitle className=''>{t('productHeading')}</CardTitle>
      </CardHeader>
      <CardContent className='sm:p-6 px-2'>
        <div>
          <TableSearch fields={['name', 'store']} />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='hidden md:table-cell'>
                {t('image')}
              </TableHead>
              <TableHead>{t('productName')}</TableHead>
              <TableHead>{t('price')}</TableHead>
              <TableHead>{t('store')}</TableHead>
              <TableHead className='hidden md:table-cell'>
                {t('featured')}
              </TableHead>
              <TableHead className='hidden md:table-cell'>
                {t('createdAt')}
              </TableHead>
              <TableHead className=''>{''}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className='sm:sm:table-cell hidden'>
                  <Image
                    src={
                      product.image
                        ? product.image
                        : 'https://kzmlp0g13xkhf3iwox9m.lite.vusercontent.net/placeholder.svg?height=400&width=600'
                    }
                    height={30}
                    width={30}
                    alt='product-image'
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {formatCurrency(
                    product.sale
                      ? product.salePrice || product.price
                      : product.price,
                  )}
                </TableCell>
                <TableCell>{product.store}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  {product.featured ? '✅' : '❌'}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {new Date(product.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {product.active && (
                        <DropdownMenuItem>
                          <Link
                            href={`/products/${product?.id}`}
                            prefetch={false}
                            className='flex items-center gap-2'
                          >
                            <Pencil height={16} width={16} />
                            {t('showProduct')}
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem>
                        <Link
                          href={`/admin/products/${product.id}`}
                          prefetch={false}
                          className='flex items-center gap-2'
                        >
                          <Eye height={16} width={16} />
                          {t('editProduct')}
                        </Link>
                      </DropdownMenuItem>

                      <Separator className='my-2' />
                      <FeaturedButton
                        productId={product.id}
                        featured={product.featured}
                      />
                      <DeleteButton id={product.id} type='product' />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className='flex flex-row items-center gap-1 justify-end'>
        <Pagination pageCount={pageCount} />
      </CardFooter>
    </Card>
  );
};
