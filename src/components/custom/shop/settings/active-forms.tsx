'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useState, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { changeStatus } from '../../../../../actions/store/change-status';

interface ActiveFormsProps {
  activeValue: boolean;
}

export const ActiveForms = ({ activeValue }: ActiveFormsProps) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(activeValue);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStatusChange = () => {
    setActive(!active);
    startTransition(() => {
      changeStatus(!active).then((res) => {
        if (res?.error) {
          toast({
            title: t('error'),
            description: t(res.error),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('success'),
            description: t(res.success || 'changedStatus'),
          });
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className='font-semibold flex flex-row gap-3 items-center text-2xl '>
          {t('storeStatus')}
        </h2>
        <p className='text-sm font-normal text-muted-foreground'>
          {t('storeStatusDesc')}
        </p>
      </CardHeader>
      <CardContent className=''>
        <div className='flex flex-row items-center justify-between'>
          <div>
            <h3 className='font-semibold flex flex-row gap-3 items-center text-lg '>
              {t('storeActive')}
            </h3>
            <p className='text-sm font-normal text-muted-foreground'>
              {t('storeActiveDesc')}
            </p>
          </div>
          <Switch
            checked={active}
            onCheckedChange={handleStatusChange}
            id='active'
            disabled={isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
};
