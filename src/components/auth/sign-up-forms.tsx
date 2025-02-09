'use client';
import { useForm } from 'react-hook-form';
import { CardWrapper } from './card-wrapper';
import { z } from 'zod';
import { signUpSchema } from '../../../schemas';
import { startTransition, useState, useTransition } from 'react';
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
import { FormError } from '../custom/form-error';
import { FormSuccess } from '../custom/form-success';
import { zodResolver } from '@hookform/resolvers/zod';

export const SignUpForms = () => {
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log(data);

    startTransition(() => {
      register(data).then((res) => {
        console.log(res);
        if (res?.error) {
          setError(res?.error);
        } else {
          setSuccess(res?.success);
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
      <FormError message={error} />
      <FormSuccess message={success} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col space-y-8 mt-4'
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
          <Button type='submit' className='mt-8' disabled={isPending}>
            Registreties
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
