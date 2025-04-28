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

export const DeleteAccountDialog = () => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();
  const handleDeleteAccount = () => {
    startTransition(() => {
      deleteAccount().then((res) => {
        if (res.error) {
          toast({
            title: t('error'),
            variant: 'destructive',
            description: t(res.error),
          });
        }
      });
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className='mt-2'>
        <Button variant={'destructive'} disabled={isPending}>
          {t('deleteAccount')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteAccountDesc')}
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
              {t('deleteAccount')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
