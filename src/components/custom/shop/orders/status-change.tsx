'use client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { statusMap } from '@/lib/utils';
import { useState, useTransition } from 'react';
import { changeOrderStatus } from '../../../../../actions/orders/change-status';

type Status = 'pending' | 'shipped' | 'complete' | 'returned';

interface StatusChangeProps {
  initialStatus: Status;
  orderItemId: string;
}

export const StatusChange = ({
  initialStatus,
  orderItemId,
}: StatusChangeProps) => {
  const [status, setStatus] = useState<Status>(initialStatus);

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleChangeOrderStatus = () => {
    startTransition(() => {
      changeOrderStatus(orderItemId, status).then((res) => {
        if (res.error) {
          toast({
            title: 'Kluda!',
            description: res.error,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Samainits!',
            description: res.success,
          });
        }
      });
    });
  };

  const mappedStatus = statusMap[status];

  return (
    <div className='flex gap-2 items-center flex-row'>
      <p className='text-sm'>Statuss:</p>
      {mappedStatus.id === 'pending' ? (
        <p className='text-sm px-3 rounded-full border-blue-500 bg-blue-100 text-blue-500'>
          {mappedStatus.label}
        </p>
      ) : mappedStatus.id === 'shipped' ? (
        <p className='text-sm px-3 rounded-full border-purple-500 bg-purple-100 text-purple-500'>
          {mappedStatus.label}
        </p>
      ) : mappedStatus.id === 'complete' ? (
        <p className='text-sm px-3 rounded-full border-green-500 bg-green-100 text-green-700'>
          {mappedStatus.label}
        </p>
      ) : (
        <p className='text-sm px-3 rounded-full border-red-500 bg-red-100 text-red-500'>
          {mappedStatus.label}
        </p>
      )}

      <Select
        value={status}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className='w-[200px]' aria-label='Status change'>
          <SelectValue placeholder='Izvēlēties statusu' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Statuss</SelectLabel>
            <SelectItem value='pending'>Gaida</SelectItem>
            <SelectItem value='shipped'>Izsūtīts</SelectItem>
            <SelectItem value='complete'>Pabeigts</SelectItem>
            <SelectItem value='returned'>Atgriezts</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          handleChangeOrderStatus();
        }}
        disabled={isPending}
      >
        Mainit statusu
      </Button>
    </div>
  );
};
