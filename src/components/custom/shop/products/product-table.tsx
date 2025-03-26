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
import { EllipsisIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import { deleteProduct } from '../../../../../actions/delete-product';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
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

  console.log(products);
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl  font-semibold leading-none tracking-tight'>
          Produktu parvaldnieks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='sm:visible hidden'>Bilde</TableHead>
              <TableHead>Nosaukums</TableHead>
              <TableHead>Cena</TableHead>
              <TableHead>Daudzums</TableHead>
              <TableHead>Statuss</TableHead>
              <TableHead>akcvijas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id} className=''>
                <TableCell className='sm:visible hidden'>
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
                <TableCell>€ {product.price}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  {product.isActive && product.quantity < 5 ? (
                    <Badge className='bg-orange-300'>
                      Zems daudzuma limenis
                    </Badge>
                  ) : product.isActive ? (
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
                          href={`/store/products/${product.slug}`}
                          prefetch={false}
                        >
                          Paradit produktu lapu
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Rediget</DropdownMenuItem>
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
