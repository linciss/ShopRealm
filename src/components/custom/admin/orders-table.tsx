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
import { EllipsisIcon, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Pagination } from './pagination';
import { TableSearch } from '../table-search';
import { formatCurrency } from '@/lib/format-currency';

interface OrdersTableProps {
  orders:
    | {
        id: string;
        user: string;
        storeId: string;
        storeName: string;
        email: string;
        status: string;
        totalPrice: number;
        createdAt: Date;
        escrowStatus: string;
      }[]
    | undefined;
  t: (value: string) => string;
  pageCount: number;
}

export const OrdersTable = async ({
  orders,
  t,
  pageCount,
}: OrdersTableProps) => {
  return (
    <Card>
      <CardHeader className='sm:p-6 px-2 !pb-0'>
        <CardTitle className=''>{t('orders')}</CardTitle>
      </CardHeader>
      <CardContent className='sm:p-6 px-2'>
        <div>
          <TableSearch fields={['id', 'user']} />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='hidden md:table-cell'>
                {t('orderId')}
              </TableHead>
              <TableHead className='hidden md:table-cell'>
                {t('orderPlacer')}
              </TableHead>
              <TableHead>{t('total')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className='hidden md:table-cell'>
                {t('escrowStatus')}
              </TableHead>
              <TableHead className='hidden md:table-cell'>
                {t('createdAt')}
              </TableHead>
              <TableHead className=''>{''}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className='sm:sm:table-cell hidden'>
                  {t('order')} {order.id}
                </TableCell>
                <TableCell>{order.user}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>{t(order.status)}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  {t(order.escrowStatus)}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {new Date(order.createdAt).toLocaleDateString()}
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
                          href={`/admin/orders/${order.id}`}
                          prefetch={false}
                          className='flex items-center gap-2'
                        >
                          <Eye height={16} width={16} />
                          {t('inspectOrder')}
                        </Link>
                      </DropdownMenuItem>

                      <Separator className='my-2' />
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
