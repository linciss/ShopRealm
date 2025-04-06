import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

interface OrderTableProps {
  orders:
    | {
        id: string;
        status: string;
        order: {
          createdAt: Date;
        };
        quantity: number;
        priceAtOrder: number;
        total: number;
      }[]
    | undefined;
}

export const OrderTable = ({ orders }: OrderTableProps) => {
  return (
    <Card>
      <CardHeader className='sm:p-6 px-2'>
        <CardTitle className='text-2xl  font-semibold leading-none tracking-tight'>
          Pasutijumu parvaldnieks
        </CardTitle>
      </CardHeader>
      <CardContent className='sm:p-6 px-2'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datums</TableHead>
              <TableHead>Pasutijuma datums</TableHead>
              <TableHead>Statuss</TableHead>
              <TableHead>Summa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Button variant={'link'}>
                    <Link href={`/store/orders/${order.id}`} prefetch={true}>
                      {order.id}
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  {new Date(order.order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
