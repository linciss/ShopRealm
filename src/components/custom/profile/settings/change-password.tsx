'use client';

import { useForm } from 'react-hook-form';
import { CardWrapper } from './card-wrapper';
import { z } from 'zod';
import { changePasswordSchema } from '../../../../../schemas';
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

export const ChangePassword = () => {
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });
  const onSubmit = (data: z.infer<typeof changePasswordSchema>) => {
    console.log(data);
  };

  return (
    <CardWrapper
      cardHeader={
        <>
          <h2 className='text-2xl font-semibold'>Paroles maiņa</h2>
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
                  <FormLabel>Vecā parole</FormLabel>
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
                  <FormLabel>Jaunā parole</FormLabel>
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
                  <FormLabel>Jaunā parole atkārtoti</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='********' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Mainīt</Button>
          </form>
        </Form>
      }
    />
  );
};
