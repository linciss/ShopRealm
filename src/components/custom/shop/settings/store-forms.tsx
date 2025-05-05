'use client';

// import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Pencil, Store } from 'lucide-react';
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
import { useTransition } from 'react';
import { redirect } from 'next/navigation';
import { editUserStore } from '../../../../../actions/store/edit-store';
import { storeSchema } from '../../../../../schemas';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

interface UserProps {
  storeInfo: {
    phone: string | null | undefined;
    name?: string;
    description?: string;
  };
}

export const StoreForms = ({ storeInfo }: UserProps) => {
  const form = useForm<z.infer<typeof storeSchema>>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: storeInfo.name || '',
      description: storeInfo.description || '',
      phone: storeInfo.phone as string | '',
    },
  });

  const { t } = useTranslation();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: z.infer<typeof storeSchema>) => {
    startTransition(() => {
      editUserStore(data).then((res) => {
        if (res?.error) {
          toast({
            title: t('error'),
            description: t(res.error),
            variant: 'destructive',
          });
        } else if (res.success1) {
          toast({
            title: t('success'),
            description: t(res.success1 || 'storeCreated'),
          });
          setTimeout(() => {
            redirect('/store');
          }, 1000);
        } else {
          toast({
            title: t('success'),
            description: t(res.success || 'changedInfo'),
          });
        }
      });
    });
  };

  return (
    <Card className='w-full p-8 text-start'>
      <CardTitle className='flex flex-col gap-2'>
        <h2 className='font-semibold flex flex-row gap-3 items-center text-2xl'>
          <Store />
          {t('storeInfo')}
        </h2>
        <p className='text-sm font-normal text-muted-foreground'>
          {t('storeInfoDesc')}
        </p>
      </CardTitle>
      <CardContent className='p-0 text-start'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col space-y-3 mt-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('storeName')}</FormLabel>
                  <FormControl>
                    <Input placeholder='Shop Realm' {...field} required />
                  </FormControl>
                  <FormDescription>{t('storeNameDesc')}</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('storeDesc')}</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field} required />
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
                  <FormLabel>{t('storePhone')}</FormLabel>
                  <FormControl>
                    <Input placeholder='22446688' {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='max-w-10'>
              <Button
                disabled={isPending}
                type='submit'
                className='flex flex-row items-center'
              >
                <Pencil className='mr-2 h-4 w-4' />
                {t('submit')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
