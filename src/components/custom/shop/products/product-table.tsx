'use client';
import { Badge } from '@/components/ui/badge';
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
import { EllipsisIcon, Eye, Pencil, Trash } from 'lucide-react';
import Image from 'next/image';
import { deleteProduct } from '../../../../../actions/product/delete-product';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { formatCurrency } from './../../../../lib/format-currency';

interface Product {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string | null;
  isActive: boolean;
  slug: string;
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
  const handleDelete = async (productId: string) => {
    startTransition(() => {
      deleteProduct(productId).then((res) => {
        if (res?.error) {
          toast({
            title: 'Kluda!',
            description: res.error,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Izdzests!',
            description: res.success,
            variant: 'default',
          });
          setProducts((prev) => prev?.filter((prod) => prod.id !== productId));
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader className='sm:p-6 px-2'>
        <CardTitle className='text-2xl  font-semibold leading-none tracking-tight'>
          Produktu parvaldnieks
        </CardTitle>
      </CardHeader>
      <CardContent className='sm:p-6 px-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='sm:block hidden'>Bilde</TableHead>
              <TableHead>Nosaukums</TableHead>
              <TableHead>Cena</TableHead>
              <TableHead>Daudzums</TableHead>
              <TableHead className='sm:block hidden'>Statuss</TableHead>
              <TableHead>akcvijas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id} className=''>
                <TableCell className='sm:block hidden'>
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
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell className='sm:block hidden'>
                  {product.isActive &&
                  product.quantity < 5 &&
                  product.quantity > 0 ? (
                    <Badge className='bg-orange-300'>Zems daudzums</Badge>
                  ) : product.isActive && product.quantity > 0 ? (
                    <Badge className='bg-green-300'>Aktivs</Badge>
                  ) : (
                    <Badge className='bg-red-500'>Neaktivs</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Akcijas</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          href={`/store/products/${product.id}`}
                          prefetch={false}
                          className='flex items-center gap-1'
                        >
                          <Eye height={16} width={16} />
                          Paradit produktu lapu
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href={`/store/products/configurator/${product.id}`}
                          prefetch={false}
                          className='flex items-center gap-1 '
                        >
                          <Pencil height={16} width={16} />
                          Rediget
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
                        Dzest
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
