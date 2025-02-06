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
import { startTransition } from 'react';
import { login } from '../../../actions/login';

export const SignInForms = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    console.log(data);

    startTransition(() => {
      login(data)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  return (
    <CardWrapper
      formType='Pieslēgšanās'
      label='Pieslēdzies, lai izmantotu visas funkcijas'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col space-y-8'
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
          <Button type='submit' className='mt-8'>
            Pieslēgties
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
