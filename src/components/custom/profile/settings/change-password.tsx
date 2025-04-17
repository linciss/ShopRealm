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

  const [isPending, startTransition] = useTransition();
  const onSubmit = (data: z.infer<typeof changeProfilePasswordSchema>) => {
    startTransition(() => {
      changePassword(data).then((res) => {
        if (res.error) {
          toast({
            variant: 'destructive',
            title: 'Kluda!',
            description: res.error,
          });
        } else {
          toast({
            title: 'Samainits!',
            description: res.success,
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
            <Button type='submit' disabled={isPending}>
              Mainīt
            </Button>
          </form>
        </Form>
      }
    />
  );
};
