'use client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DeleteStoreProps {
  storeId: string;
}
export const DeleteStore = ({ storeId }: DeleteStoreProps) => {
  const isPending = false;
  const { t } = useTranslation();

  const handleDelete = (id: string) => {
    console.log(id);
  };

  return (
    <DropdownMenuItem
      disabled={isPending}
      className='text-red-500 text-center'
      onClick={() => {
        handleDelete(storeId);
      }}
    >
      <Trash />
      {t('deleteStore')}
    </DropdownMenuItem>
  );
};
