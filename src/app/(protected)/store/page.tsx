import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function Store() {
  return (
    <div className='py-10'>
      <div className='flex flex-row justify-between'>
        <h1 className='text-2xl font-bold'>informācijas panelis</h1>
        <div className='space-x-2'>
          <Link href={`/store/items`}>
            <Button>
              <Plus />
              Pievienot preci
            </Button>
          </Link>
          <Link href={`/store/items`}>
            <Button variant={'secondary'}>
              <Eye />
              Paradit veikalu
            </Button>
          </Link>
        </div>
      </div>
      <div className='grid grid-cols-4'></div>
    </div>
  );
}
