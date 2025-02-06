'use client';
import { useForm } from 'react-hook-form';
import { CardWrapper } from './card-wrapper';
import { z } from 'zod';
import { signUpSchema } from '../../../schemas';
import { startTransition } from 'react';
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

export const SignUpForms = () => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log(data);

    startTransition(() => {
      register(data)
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
      formType='Reģistrācija'
      label='Reģistrējies, lai izmantotu visas funkcijas'
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
          <FormField
            control={form.control}
            name='passwordConfirmation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parole vcelvienreiz</FormLabel>
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
            Registreties
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
