'use client';
import { CardWrapper } from './card-wrapper';
import { z } from 'zod';
import { forgotPasswordSchema } from '../../../schemas';
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
import { reqeustResetToken } from '../../../actions/user/reset-password';

export const ForgotPasswordForms = () => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const { t } = useTranslation();

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(() => {
      reqeustResetToken(data).then((res) => {
        if (res.error) {
          toast({
            description: t(res.error),
            title: t('error'),
            variant: 'destructive',
          });
        } else {
          toast({
            description: t(res.success || 'resetEmailSent'),
            title: t('success'),
          });
        }
      });
    });
  };

  return (
    <CardWrapper
      formType={t('forgotPass')}
      label={t('forgotPassDesc')}
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
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='john@doe.com'
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
            {t('sendToken')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
