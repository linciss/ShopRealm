'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { personalInfoSchema } from '../../../../schemas';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { Camera } from 'lucide-react';
import Image from 'next/image';

interface PersonalFormsProps {
  userData: {
    name: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
}

export const PersonalForms = ({ userData }: PersonalFormsProps) => {
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: userData.name,
      lastName: userData.lastName,
      phone: userData.phone || '',
    },
  });

  function onSubmit(values: z.infer<typeof personalInfoSchema>) {
    console.log(values);
  }

  return (
    <div className='flex flex-col items-center sm:flex-row sm:items-start gap-8'>
      <Form {...form}>
        <div className='relative'>
          <div className='h-32 w-32 rounded-full bg-muted flex items-center justify-center overflow-hidden'>
            <Image
              src='https://kzmlp0g13xkhf3iwox9m.lite.vusercontent.net/placeholder.svg?height=400&width=600'
              alt='Profile'
              priority
              className='h-full w-full object-cover'
              width={128}
              height={128}
            />
          </div>
          <Button
            size='icon'
            variant='secondary'
            className='absolute bottom-0 right-0 rounded-full'
          >
            <Camera className='h-4 w-4' />
          </Button>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 flex flex-col w-full'
        >
          <div className='grid grid-cols-2 w-full gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vards</FormLabel>
                  <FormControl>
                    <Input placeholder='John' {...field} />
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
                  <FormLabel>Uzvards</FormLabel>
                  <FormControl>
                    <Input placeholder='Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input value={userData.email} disabled />
            </FormControl>
            <FormDescription>
              Ja vēlies pārmainīt epastu, tad dodies uz iestatījumiem
            </FormDescription>
          </FormItem>
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefona numurs</FormLabel>
                <FormControl>
                  <Input placeholder='22445629' {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='max-w-10'>
            <Button type='submit'>Iesniegt</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
