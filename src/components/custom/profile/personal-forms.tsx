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
import { Pencil } from 'lucide-react';
import { useTransition } from 'react';
import { editUserProfile } from '../../../../actions/user/edit-user';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

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

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const { t } = useTranslation();

  function onSubmit(data: z.infer<typeof personalInfoSchema>) {
    startTransition(() => {
      editUserProfile(data).then((res) => {
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
            <div className='grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 w-full gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')}</FormLabel>
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
                    <FormLabel>{t('lastName')}</FormLabel>
                    <FormControl>
                      <Input placeholder='Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl>
                <Input value={userData.email} disabled />
              </FormControl>
              <FormDescription>{t('wantChangeEmail')}</FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <FormControl>
                    <Input placeholder='22446688' {...field} />
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
                {t('saveProfileData')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};
