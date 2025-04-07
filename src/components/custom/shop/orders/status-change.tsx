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
import { statusMap } from '@/lib/utils';
import { useState } from 'react';

type Status = 'pending' | 'shipped' | 'complete' | 'returned';

interface StatusChangeProps {
  initialStatus: Status;
}

export const StatusChange = ({ initialStatus }: StatusChangeProps) => {
  const [status, setStatus] = useState<Status>(initialStatus);

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
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

      <Select value={status} onValueChange={handleStatusChange}>
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
      <Button>Mainit statusu</Button>
    </div>
  );
};
