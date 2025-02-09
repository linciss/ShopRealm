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
import { startTransition, useState, useTransition } from 'react';
import { login } from '../../../actions/login';
import { FormError } from '../custom/form-error';
import { FormSuccess } from '../custom/form-success';

export const SignInForms = () => {
  const [success, setSuccess] = useState<string | undefined>(null);
  const [error, setError] = useState<string | undefined>(null);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    console.log(data);

    setError('');
    setSuccess('');

    startTransition(() => {
      login(data).then((res) => {
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
      formType='Pieslēgšanās'
      label='Pieslēdzies, lai izmantotu visas funkcijas'
      footerText='Nav konta? Reģistrējies un izmanto visas funkcijas'
      footerUrl='/auth/sign-up'
    >
      <FormError message={error} />
      <FormSuccess message={success} />
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
          <Button type='submit' className='mt-8' disabled={isPending}>
            Pieslēgties
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
