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
import { useTransition } from 'react';
import { editUserAddress } from '../../../../actions/user/edit-address';
import { useToast } from '@/hooks/use-toast';
import { supportedCountries } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

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

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const { t } = useTranslation();

  function onSubmit(data: z.infer<typeof addressInfoSchema>) {
    startTransition(() => {
      editUserAddress(data).then((res) => {
        if (res?.error) {
          toast({
            title: t('error'),
            description: t(res.error),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('success'),
            description: t(res.success || 'changedInfo'),
          });
        }
      });
    });
  }

  return (
    <Card className='p-6 mt-5'>
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
                    <FormLabel>{t('street')}</FormLabel>
                    <FormControl>
                      <Input placeholder='Zalu iela 13' {...field} />
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
                    <FormLabel>{t('city')}</FormLabel>
                    <FormControl>
                      <Input placeholder='Liepaja' {...field} />
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
                    <FormLabel>{t('country')}</FormLabel>
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
                        {supportedCountries.map((country, idx) => (
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
                    <FormLabel>{t('postalCode')}</FormLabel>
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
                {t('saveData')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};
