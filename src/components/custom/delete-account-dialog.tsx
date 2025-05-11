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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { deleteConfirmationSchema } from '../../../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';

interface DeleteAccountDialog {
  store?: boolean;
}
export const DeleteAccountDialog = ({ store = false }: DeleteAccountDialog) => {
  const form = useForm<z.infer<typeof deleteConfirmationSchema>>({
    resolver: zodResolver(deleteConfirmationSchema),
    defaultValues: {
      password: '',
    },
  });

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();
  const router = useRouter();

  const handleDeleteAccount = (
    data: z.infer<typeof deleteConfirmationSchema>,
  ) => {
    startTransition(() => {
      if (store) {
        deleteStore(data).then((res) => {
          if (res.error) {
            toast({
              title: t('error'),
              variant: 'destructive',
              description: t(res.error),
            });
          }
        });
      } else {
        deleteAccount(data).then((res) => {
          if (res.error) {
            toast({
              title: t('error'),
              variant: 'destructive',
              description: t(res.error),
            });
          } else {
            router.push('/products');
          }
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} disabled={isPending}>
          {t(store ? 'deleteStore' : 'deleteAccount')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDeleteAccount)}>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t(store ? 'deleteStoreDesc' : 'deleteAccountDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>{t('passwordConfirm')}</FormLabel>
                  <FormControl>
                    <Input placeholder='******' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className='mt-4'>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button disabled={isPending} type='submit'>
                  {t(store ? 'deleteStore' : 'deleteAccount')}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
