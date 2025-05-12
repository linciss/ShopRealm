'use client';
import { useForm } from 'react-hook-form';
import { CardWrapper } from './card-wrapper';
import { z } from 'zod';
import { signUpSchema } from '../../../schemas';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { startTransition, useEffect, useTransition } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { register } from '../../../actions/auth/register';
import { useTranslation } from 'react-i18next';

export const SignUpForms = () => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    router.prefetch('/products');
  }, [router]);

  const redirect = searchParams.get('redirect') ? true : false;

  const { t } = useTranslation();

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    startTransition(() => {
      register(data, redirect).then((res) => {
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
      formType={t('register')}
      label={t('registerDesc')}
      footerText={t('alreadyHaveAccount')}
      footerUrl={`/auth/sign-in${redirect ? '?redirect=true' : ''}`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col space-y-4 mt-4'
        >
          <div className='flex flex-row space-x-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input type='name' placeholder='John' {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('lastName')}</FormLabel>
                  <FormControl>
                    <Input
                      type='lastName'
                      placeholder='Doe'
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
          <FormField
            control={form.control}
            name='passwordConfirmation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('confirmPassword')}</FormLabel>
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
            aria-label='Register'
          >
            {t('register')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
