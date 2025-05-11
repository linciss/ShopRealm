'use client';

// import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useRouter } from 'next/navigation';
import { editUserStore } from '../../../../../actions/store/edit-store';
import { storeSchema } from '../../../../../schemas';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

interface UserProps {
  storeInfo: {
    id?: string;
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
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: z.infer<typeof storeSchema>) => {
    startTransition(() => {
      editUserStore(data, storeInfo.id).then((res) => {
        if (res?.error) {
          toast({
            title: t('error'),
            description: t(res.error),
            variant: 'destructive',
          });
          return;
        } else if (res.success1) {
          toast({
            title: t('success'),
            description: t(res.success1 || 'storeCreated'),
          });
          setTimeout(() => {
            const redirectUrl = !storeInfo.id ? '/store' : '/admin/store';
            router.push(redirectUrl);
          }, 2000);
        } else {
          toast({
            title: t('success'),
            description: t(res.success || 'changedInfo'),
          });
        }
        setTimeout(() => {
          const redirectUrl = !storeInfo.id ? '/store' : '/admin/store';
          router.push(redirectUrl);
        }, 2000);
      });
    });
  };

  return (
    <Card className=''>
      <CardHeader>
        <CardTitle className='flex items-center  gap-2'>
          <Store className='h-[17px] w[[17px]' />
          {t('storeInfo')}
        </CardTitle>
        <p className='text-sm font-normal text-muted-foreground'>
          {t('storeInfoDesc')}
        </p>
      </CardHeader>

      <CardContent className=''>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col space-y-3'
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

            <div className='flex justify-end'>
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
