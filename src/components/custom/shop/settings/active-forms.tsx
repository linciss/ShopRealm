'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useState, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { changeStatus } from '../../../../../actions/store/change-status';

interface ActiveFormsProps {
  id?: string;
  activeValue: boolean;
}

export const ActiveForms = ({ activeValue, id }: ActiveFormsProps) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(activeValue);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStatusChange = () => {
    setActive(!active);
    startTransition(() => {
      changeStatus(!active, id).then((res) => {
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
        <CardTitle>{t('storeStatus')}</CardTitle>
        <CardDescription>{t('storeStatusDesc')}</CardDescription>
      </CardHeader>
      <CardContent className=''>
        <div className='flex flex-row items-center justify-between'>
          <div>
            <h3 className='font-semibold flex flex-row gap-3 items-center text-sm '>
              {t('storeActive')}
            </h3>
            <p className='text-xs font-normal text-muted-foreground'>
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
