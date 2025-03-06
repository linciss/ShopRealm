'use client';

// import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { storeSchema } from '../../../../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UserProps {
  phone: string | null | undefined;
  userId: string | undefined;
}

export const StoreForms = ({ phone, userId }: UserProps) => {
  //   const [success, setSuccess] = useState<string | undefined>();
  //   const [error, setError] = useState<string | undefined>();
  const form = useForm<z.infer<typeof storeSchema>>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      description: '',
      phone: phone as string | '',
    },
  });

  const onSubmit = async (value: z.infer<typeof storeSchema>) => {
    console.log(value, userId);
  };

  return (
    <Card className='w-full p-8 text-start'>
      <CardTitle className='flex flex-col gap-2'>
        <h2 className='font-semibold flex flex-row gap-3 items-center text-xl sm:text-2xl'>
          <Store />
          Veikala informacija
        </h2>
        <p className='text-sm font-normal text-muted-foreground'>
          Aizpildi visus laukus, lai izveidotu savu veikalu, Visi lauki ir
          jaaizpilda!
        </p>
      </CardTitle>
      <CardContent className='p-0 text-start'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col space-y-8 mt-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veiakal nosaukums</FormLabel>
                  <FormControl>
                    <Input placeholder='Shop Sphere' {...field} required />
                  </FormControl>
                  <FormDescription>
                    Sis laus identificet jusu veikalu
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parole</FormLabel>
                  <FormControl>
                    <Input placeholder='Bla bla bla' {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefons</FormLabel>
                  <FormControl>
                    <Input placeholder='Bla bla bla' {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='mt-8' disabled={false}>
              Izveidot!
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
