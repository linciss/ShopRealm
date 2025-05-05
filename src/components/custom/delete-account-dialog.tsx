'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deleteAccount } from '../../../actions/user/delete';
import { useTranslation } from 'react-i18next';
import { deleteStore } from '../../../actions/store/delete-store';

interface DeleteAccountDialog {
  store?: boolean;
}
export const DeleteAccountDialog = ({ store = false }: DeleteAccountDialog) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();
  const handleDeleteAccount = () => {
    startTransition(() => {
      if (store) {
        deleteStore().then((res) => {
          if (res.error) {
            toast({
              title: t('error'),
              variant: 'destructive',
              description: t(res.error),
            });
          }
        });
      } else {
        deleteAccount().then((res) => {
          if (res.error) {
            toast({
              title: t('error'),
              variant: 'destructive',
              description: t(res.error),
            });
          }
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className='mt-2'>
        <Button variant={'destructive'} disabled={isPending}>
          {t(store ? 'deleteStore' : 'deleteAccount')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(store ? 'deleteStoreDesc' : 'deleteAccountDesc')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                handleDeleteAccount();
              }}
              disabled={isPending}
              variant={'destructive'}
            >
              {t(store ? 'deleteStore' : 'deleteAccount')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
