'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EllipsisIcon, Eye, Loader2, Pencil, Trash } from 'lucide-react';
import Image from 'next/image';
import { deleteProduct } from '../../../../../actions/product/delete-product';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { formatCurrency } from './../../../../lib/format-currency';
import { useTranslation } from 'react-i18next';

interface Product {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string | null;
  isActive: boolean;
  slug: string;
  sale: boolean;
  salePrice: string | null;
}

interface ProductListProps {
  initialProducts: Product[] | undefined;
}

export const ProductTable = ({ initialProducts }: ProductListProps) => {
  const [products, setProducts] = useState<Product[] | undefined>(
    initialProducts,
  );
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleDelete = async (productId: string) => {
    startTransition(() => {
      deleteProduct(productId).then((res) => {
        if (res?.error) {
          toast({
            title: t('error'),
            description: t(res.error),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('success'),
            description: t(res.success || 'productDeleted'),
            variant: 'default',
          });
          setProducts((prev) => prev?.filter((prod) => prod.id !== productId));
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader className='sm:p-6 px-2 !pb-0'>
        <CardTitle className=''>{t('productManager')}</CardTitle>
      </CardHeader>
      <CardContent className='sm:p-6 px-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='sm:table-cell hidden'>
                {t('image')}
              </TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('price')}</TableHead>
              <TableHead className='sm:table-cell hidden'>
                {t('quantity')}
              </TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products ? (
              products.map((product) => (
                <TableRow key={product.id} className=''>
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
                  <TableCell className='sm:table-cell hidden'>
                    {product.quantity}
                  </TableCell>
                  <TableCell>
                    {product.isActive &&
                    product.quantity < 5 &&
                    product.quantity > 0 ? (
                      <p className='w-fit text-sm px-3 rounded-full border-orange-500 bg-orange-100 text-orange-500'>
                        {t('lowQuantity')}
                      </p>
                    ) : product.isActive && product.quantity > 0 ? (
                      <p className='w-fit text-sm px-3 rounded-full border-green-700 bg-green-100 text-green-700'>
                        {t('active')}
                      </p>
                    ) : (
                      <p className='w-fit text-sm px-3 rounded-full border-red-500 bg-red-100 text-red-500'>
                        {t('inactive')}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            href={`/store/products/${product.id}`}
                            prefetch={false}
                            className='flex items-center gap-1'
                          >
                            <Eye height={16} width={16} />
                            {t('showProductPage')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`/store/products/configurator/${product.id}`}
                            prefetch={true}
                            className='flex items-center gap-1 '
                          >
                            <Pencil height={16} width={16} />
                            {t('editProduct')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={isPending}
                          className='text-red-500 text-center'
                          onClick={() => {
                            handleDelete(product.id);
                          }}
                        >
                          <Trash />
                          {t('deleteProduct')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <Loader2 className='self-center animate-spin' />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
