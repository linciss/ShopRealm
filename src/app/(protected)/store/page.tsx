import { StatCard } from '@/components/custom/shop/stat-card';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function Store() {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center flex-col md:flex-row gap-4'>
        <h1 className='text-3xl font-bold '>Informācijas panelis</h1>
        <div className='space-x-2 flex-nowrap flex flex-row'>
          <Link href={`/store/products`}>
            <Button aria-label='Add item'>
              <Plus />
              Pievienot preci
            </Button>
          </Link>
          <Link href={`/store/products`} aria-label='Products page'>
            <Button variant={'outline'} aria-label='Products page'>
              <Eye />
              Paradit veikalu
            </Button>
          </Link>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard />
        <StatCard />
        <StatCard />
        <StatCard />
      </div>
    </div>
  );
}
