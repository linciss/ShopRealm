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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const [isPending, startTransition] = useTransition();

  const handleChangeOrderStatus = () => {
    startTransition(() => {
      changeOrderStatus(orderItemId, status).then((res) => {
        if (res.error) {
          toast({
            title: t('error'),
            description: t(res.error),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('success'),
            description: t(res.success || 'statusChanged'),
          });
        }
      });
    });
  };

  const mappedStatus = statusMap[initialStatus];

  return (
    <div className='flex gap-2 items-center flex-row'>
      <p className='text-sm'>{t('status')}:</p>
      {badgeMap(mappedStatus.id, t)}
      <Select
        value={status}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className='w-[200px]' aria-label='Status change'>
          <SelectValue placeholder={t('chooseStatus')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('status')}</SelectLabel>
            <SelectItem value='pending'>{t('pending')}</SelectItem>
            <SelectItem value='shipped'>{t('shipped')}</SelectItem>
            <SelectItem value='complete'>{t('complete')}</SelectItem>
            <SelectItem value='returned'>{t('returned')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          handleChangeOrderStatus();
        }}
        disabled={isPending}
      >
        {t('changeStatus')}
      </Button>
    </div>
  );
};
