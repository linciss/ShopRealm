'use client';

import { useForm } from 'react-hook-form';
import { CardWrapper } from './card-wrapper';
import { z } from 'zod';
import { changeProfilePasswordSchema } from '../../../../../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { changePassword } from '../../../../../actions/user/change-password';
import { useTranslation } from 'react-i18next';

export const ChangePassword = () => {
  const form = useForm<z.infer<typeof changeProfilePasswordSchema>>({
    resolver: zodResolver(changeProfilePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  const { toast } = useToast();
  const { t } = useTranslation();

  const [isPending, startTransition] = useTransition();
  const onSubmit = (data: z.infer<typeof changeProfilePasswordSchema>) => {
    startTransition(() => {
      changePassword(data).then((res) => {
        if (res.error) {
          toast({
            variant: 'destructive',
            title: t('error'),
            description: t(res.error),
          });
        } else {
          toast({
            title: t('success'),
            description: t(res.success || 'passwordChanged'),
          });
          form.reset({
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
          });
        }
      });
    });
  };

  return (
    <CardWrapper
      cardHeader={
        <>
          <h2 className='text-2xl font-semibold'>{t('passwordChange')}</h2>
        </>
      }
      cardContent={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('oldPassword')}</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='********' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('newPassword')}</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='********' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPasswordConfirm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirmNewPassword')}</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='********' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isPending}>
              {t('passwordChange')}
            </Button>
          </form>
        </Form>
      }
    />
  );
};
