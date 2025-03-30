'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { addressInfoSchema } from '../../../../schemas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil } from 'lucide-react';
import { useState, useTransition } from 'react';
import { editUserAddress } from '../../../../actions/user/edit-address';

interface AddressFormsProps {
  userAddress: {
    street: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
  };
}

export const AddressForms = ({ userAddress }: AddressFormsProps) => {
  const form = useForm<z.infer<typeof addressInfoSchema>>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: {
      street: userAddress.street || '',
      city: userAddress.city || '',
      country: userAddress.country || '',
      postalCode: userAddress.postalCode || '',
    },
  });

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: z.infer<typeof addressInfoSchema>) {
    startTransition(() => {
      editUserAddress(data).then((res) => {
        if (res?.error) {
          setError(res?.error);
        } else {
          setSuccess(res?.success);
        }
      });
    });
  }

  return (
    <div className='flex flex-col items-center sm:flex-row sm:items-start gap-8'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 flex flex-col w-full'
        >
          <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-4'>
            <FormField
              control={form.control}
              name='street'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Iela</FormLabel>
                  <FormControl>
                    <Input placeholder='Brivibas' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilseta</FormLabel>
                  <FormControl>
                    <Input placeholder='B rivibas iela 23' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-4'>
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valsts</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Izvelies valsti' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country, idx) => (
                        <SelectItem key={idx} value={country}>
                          {country.charAt(0).toUpperCase() + country.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='postalCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pasta kods</FormLabel>
                  <FormControl>
                    <Input placeholder='LV-3401' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='max-w-10'>
            <Button
              disabled={isPending}
              type='submit'
              className='flex flex-row items-center'
            >
              <Pencil className='mr-2 h-4 w-4' />
              Iesniegt Adresi
            </Button>
          </div>
          {error && <p className='text-red-500'>{error}</p>}
          {success && <p className='text-green-500'>{success}</p>}
        </form>
      </Form>
    </div>
  );
};

const countries: string[] = ['latvija', 'usa', 'eng'];
