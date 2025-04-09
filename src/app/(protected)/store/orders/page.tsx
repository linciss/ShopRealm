import { CalendarClock, Clock, CreditCard, ShoppingBag } from 'lucide-react';
import { getOrders } from '../../../../../data/orders';
import { StatCard } from '@/components/custom/shop/stat-card';
import { formatCurrency } from '@/lib/format-currency';
import { OrderTable } from '@/components/custom/shop/orders/order-table';

export default async function Products() {
  const orders = await getOrders();

  const completedOrdersTotal =
    orders
      ?.filter((order) => order.status === 'complete')
      .reduce((sum, order) => sum + order.priceAtOrder * order.quantity, 0) ||
    0;

  const pendingOrdersTotal =
    orders
      ?.filter(
        (order) => order.status === 'pending' || order.status === 'shipped',
      )
      .reduce((sum, order) => sum + order.priceAtOrder * order.quantity, 0) ||
    0;

  const currentMonthOrders =
    orders?.filter((order) => {
      const orderDate = new Date(order.order.createdAt);

      const now = new Date();

      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }) || [];

  return (
    <div className='space-y-4 '>
      <div className='flex flex-col gap-4'>
        <h1 className=' font-bold text-3xl '>Pasutijumi</h1>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            name={'Visi pasutijumi'}
            value={orders?.length}
            icon={<ShoppingBag />}
          />
          <StatCard
            name={'Apstiprinati ieankumi'}
            value={formatCurrency(completedOrdersTotal)}
            icon={<CreditCard />}
            description='Pabeigti pasutijumi'
          />
          <StatCard
            name={'Gaidosie ieankumi'}
            value={formatCurrency(pendingOrdersTotal)}
            icon={<Clock />}
            description='Gaida apstradi'
          />
          <StatCard
            name={'Pasutijumu skaits šomēnes'}
            value={currentMonthOrders.length}
            icon={<CalendarClock />}
          />
        </div>
      </div>
      <div className=''>
        {orders ? <OrderTable orders={orders} /> : <div>loading....</div>}
      </div>
    </div>
  );
}
