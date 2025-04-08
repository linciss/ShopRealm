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
import { badgeMap } from './order-table';

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

  const mappedStatus = statusMap[initialStatus];

  return (
    <div className='flex gap-2 items-center flex-row'>
      <p className='text-sm'>Statuss:</p>
      {badgeMap(mappedStatus.id)}
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
