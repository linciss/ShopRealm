'use client';
import { CardWrapper } from './card-wrapper';
import { z } from 'zod';
import { signInSchema } from '../../../schemas';
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { startTransition, useEffect, useTransition } from 'react';
import { login } from '../../../actions/auth/login';

import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export const SignInForms = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (router) {
      router.prefetch('/products');
    }
  }, [router]);

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    startTransition(() => {
      login(data).then((res) => {
        if (res?.error) {
          toast({
            title: t('error'),
            description: t(`errors:${res.error}`),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('success'),
            description: t(`success:${res.success}`),
          });
        }
      });
    });
  };

  return (
    <CardWrapper
      formType={t('signIn')}
      label={t('signInDesc')}
      footerText={t('authFooter')}
      footerUrl='/auth/sign-up'
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
                    placeholder='john.doe@example.com'
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-col space-y-2'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
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
            <Link href='/auth/forgot-password'>
              <p className='text-primary text-xs'>{t('forgotPassword')}</p>
            </Link>
          </div>

          <Button
            type='submit'
            className='mt-8'
            disabled={isPending}
            aria-label='Login'
          >
            {t('signIn')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
