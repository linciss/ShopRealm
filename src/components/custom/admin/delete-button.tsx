'use client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Trash } from 'lucide-react';
import { useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteUser } from '../../../../actions/admin/delete-user';
import { deleteStore } from '../../../../actions/admin/delete-store';

interface DeleteStoreProps {
  id: string;
  type: string;
}
export const DeleteButton = ({ id, type }: DeleteStoreProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      if (type === 'user') {
        deleteUser(id).then((res) => {
          if (res.error) {
            toast({
              title: t('error'),
              description: t(res.error),
              variant: 'destructive',
            });
          } else {
            toast({
              title: t('success'),
              description: t(res.success || 'userDeleted'),
            });
          }
        });
      } else if (type === 'store') {
        deleteStore(id).then((res) => {
          if (res.error) {
            toast({
              title: t('error'),
              description: t(res.error),
              variant: 'destructive',
            });
          } else {
            toast({
              title: t('success'),
              description: t(res.success || 'storeDeleted'),
            });
          }
        });
      }
    });
  };

  return (
    <DropdownMenuItem
      disabled={isPending}
      className='text-red-500 text-center'
      onClick={handleDelete}
    >
      <Trash />
      {type === 'store'
        ? t('deleteStore')
        : type === 'user'
          ? t('deleteUser')
          : type === 'product'
            ? t('deleteProduct')
            : ''}
    </DropdownMenuItem>
  );
};
