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
import { DeleteStore } from './delete-store';
import { Separator } from '@/components/ui/separator';
import { Pagination } from './pagination';
import { TableSearch } from '../table-search';

interface OrderTableProps {
  stores:
    | {
        id: string;
        name: string;
        owner: string;
        email: string;
        products: number;
        active: boolean;
        createdAt: Date;
      }[]
    | undefined;
  t: (value: string) => string;
  pageCount: number;
}

export const StoresTable = ({ stores, t, pageCount }: OrderTableProps) => {
  return (
    <Card>
      <CardHeader className='sm:p-6 px-2 !pb-0'>
        <CardTitle className=''>{t('stores')}</CardTitle>
      </CardHeader>
      <CardContent className='sm:p-6 px-2'>
        <TableSearch fields={['storeOwner', 'email', 'storeName']} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('storeName')}</TableHead>
              <TableHead>{t('storeOwner')}</TableHead>
              <TableHead>{t('storeEmail')}</TableHead>
              <TableHead>{t('products')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className='hidden md:table-cell'>
                {t('createdAt')}
              </TableHead>
              <TableHead className=''>{''}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores?.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.owner}</TableCell>
                <TableCell>{store.email}</TableCell>
                <TableCell>{store.products}</TableCell>
                <TableCell>{store.active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  {new Date(store.createdAt).toLocaleDateString()}
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
                          href={`/store/${store.id}`}
                          prefetch={false}
                          className='flex items-center gap-1'
                        >
                          <Eye height={16} width={16} />
                          {t('showStorePage')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href={`/admin/stores/${store.id}`}
                          prefetch={false}
                          className='flex items-center gap-1 '
                        >
                          <Pencil height={16} width={16} />
                          {t('editStore')}
                        </Link>
                      </DropdownMenuItem>
                      <Separator className='my-2' />
                      <DeleteStore storeId={store.id} />
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
