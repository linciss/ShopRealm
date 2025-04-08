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

export const DeleteAccountDialog = () => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const handleDeleteAccount = () => {
    startTransition(() => {
      deleteAccount().then((res) => {
        if (res.error) {
          toast({
            title: 'Kluda!',
            variant: 'destructive',
            description: res.error,
          });
        }
      });
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className='mt-2'>
        <Button variant={'destructive'} disabled={isPending}>
          Dzest kontu
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Vai juss tiesam esat parliecinats?
          </AlertDialogTitle>
          <AlertDialogDescription>
            So darbību nevar atsaukt. Tas neatgriezeniski dzesis jusu kontu un
            nomes savus datus no musu serveriem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Atcelt</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                handleDeleteAccount();
              }}
              disabled={isPending}
              variant={'destructive'}
            >
              Dzest!
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
