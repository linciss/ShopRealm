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
import { startTransition, useTransition } from 'react';
import { login } from '../../../actions/login';

import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { redirect } from 'next/navigation';

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

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    startTransition(() => {
      login(data).then((res) => {
        if (res?.error) {
          toast({
            title: 'Kluda!',
            description: res.error,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Ielogojies!',
            description: res.success,
          });
          redirect('/products');
        }
      });
    });
  };

  return (
    <CardWrapper
      formType='Pieslēgšanās'
      label='Pieslēdzies, lai izmantotu visas funkcijas'
      footerText='Nav konta? Reģistrējies un izmanto visas funkcijas'
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
                <FormLabel>Epasts</FormLabel>
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
                  <FormLabel>Parole</FormLabel>
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
              <p className='text-primary text-xs'>Aizmirsi paroli?</p>
            </Link>
          </div>

          <Button type='submit' className='mt-8' disabled={isPending}>
            Pieslēgties
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
