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
import { register } from '../../../actions/register';

import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { redirect, useRouter } from 'next/navigation';

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

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    router.prefetch('/products');
  }, [router]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    startTransition(() => {
      register(data).then((res) => {
        if (res?.error) {
          toast({
            title: 'Kluda!',
            description: res.error,
            variant: 'destructive',
          });
        } else {
          console.log('LOGGED IN!');
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
      formType='Reģistrācija'
      label='Reģistrējies, lai izmantotu visas funkcijas'
      footerText='Jau ir konts? Pieslēdzies un izmanto visas funkcijas'
      footerUrl='/auth/sign-in'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col space-y-6 mt-4'
        >
          <div className='flex flex-row space-x-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vārds</FormLabel>
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
                  <FormLabel>Uzvārds</FormLabel>
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
          <FormField
            control={form.control}
            name='passwordConfirmation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parole atkārtoti</FormLabel>
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
          <Button type='submit' className='mt-8' disabled={isPending}>
            Registreties
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
