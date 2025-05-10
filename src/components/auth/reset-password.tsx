'use client';
import { CardWrapper } from './card-wrapper';
import { z } from 'zod';
import { createPasswordSchema } from '../../../schemas';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useTransition } from 'react';

import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { resetPassword } from '../../../actions/user/reset-password';
import { useSearchParams } from 'next/navigation';

export const ResetPasswordForms = () => {
  const form = useForm<z.infer<typeof createPasswordSchema>>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const { t } = useTranslation();

  const onSubmit = (data: z.infer<typeof createPasswordSchema>) => {
    startTransition(() => {
      resetPassword(data, token).then((res) => {
        if (res.error) {
          toast({
            description: t(res.error),
            title: t('error'),
            variant: 'destructive',
          });
        } else {
          toast({
            description: t(res.success || 'passwordReset'),
            title: t('success'),
          });
        }
      });
    });
  };

  return (
    <CardWrapper
      formType={t('passwordReset')}
      label={t('passwordResetDesc')}
      footerText={''}
      footerUrl={''}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col space-y-6 mt-4'
        >
          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('newPassword')}</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='********'
                    {...field}
                    required
                  />
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
                  <Input
                    type='password'
                    placeholder='********'
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='mt-8'
            disabled={isPending}
            aria-label='send token'
          >
            {t('resetPassword')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
