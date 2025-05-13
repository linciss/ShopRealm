'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { shippingInfoSchema } from '../../../../schemas';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supportedCountries } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createCheckoutSession } from '../../../../actions/stripe/create-session';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface User {
  email: string;
  name: string;
  lastName: string;
  phone: string | null;
  address: {
    street: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
  } | null;
}

interface CheckoutProps {
  userInfo: User;
}

export const CheckoutForm = ({ userInfo }: CheckoutProps) => {
  const [saveInfo, setSaveInfo] = useState<boolean>(true);
  const form = useForm<z.infer<typeof shippingInfoSchema>>({
    resolver: zodResolver(shippingInfoSchema),
    defaultValues: {
      name: userInfo.name || '',
      lastName: userInfo.lastName || '',
      phone: userInfo?.phone || '',
      street: userInfo?.address?.street || '',
      city: userInfo?.address?.city || '',
      country: userInfo.address?.country || '',
      postalCode: userInfo.address?.postalCode || '',
    },
  });

  const [isPending, startTransition] = useTransition();

  const redirectUrl =
    typeof window !== 'undefined' ? window.location.origin : null;

  const { toast } = useToast();

  const { t } = useTranslation();

  const onSubmit = (data: z.infer<typeof shippingInfoSchema>) => {
    startTransition(() => {
      createCheckoutSession(redirectUrl || '', data, saveInfo).then((res) => {
        if (res.url) {
          window.location.href = res.url;
        } else {
          toast({
            title: t('error'),
            description: `${t(res.error || 'error')}, ${res.productNames}`,
            variant: 'destructive',
          });
        }
      });
    });
  };

  return (
    <div className='mt-5 flex flex-col flex-[2] col-span-2 '>
      <Card>
        <CardHeader className='flex flex-col space-y-2'>
          <div className='flex flex-row items-center justify-between'>
            <CardTitle>{t('orderDetails')}</CardTitle>
            <div className='flex items-center text-sm text-muted-foreground'>
              <User className='h-4 w-4 mr-2' />
              <span>{t('usedProfileData')}</span>
              <Button
                variant='ghost'
                size='sm'
                className='ml-2 h-8 underline'
                onClick={() => {
                  form.reset({
                    street: '',
                    city: '',
                    country: '',
                    postalCode: '',
                  });
                }}
              >
                {t('clearAddress')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col space-y-6 mt-4'
            >
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='John'
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
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('lastName')}</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Doe'
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input value={userInfo.email} disabled />
                  </FormControl>
                </FormItem>

                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phone')}</FormLabel>
                      <FormControl>
                        <Input
                          type='phone'
                          placeholder='22447788'
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='street'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('address')}</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Zalu iela 13A'
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
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('city')}</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Liepaja'
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
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
                              {country.charAt(0).toUpperCase() +
                                country.slice(1)}
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
                        <Input
                          type='text'
                          placeholder='LV-3401'
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  onClick={() => setSaveInfo(!saveInfo)}
                  checked={saveInfo}
                  id='saveInfo'
                />
                <label
                  htmlFor='saveInfo'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
                >
                  {t('saveData')}
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info width={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'>
                        {t('saveDataInfo')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button disabled={isPending} onClick={() => {}}>
                {t('placeOrder')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
