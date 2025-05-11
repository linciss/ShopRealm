'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { userCreateSchema, userEditSchema } from '../../../../schemas';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';

import { useRouter } from 'next/navigation';
import { createUser, editUser } from '../../../../actions/admin/user-configure';

type AdminLevel = 'SUPER_ADMIN' | 'ADMIN';

interface UserFormProps {
  userData?: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string | null;
    adminPrivileges: boolean | null;
    adminLevel: AdminLevel | null;
  };
  adminLevel: string;
}

export const UserForm = ({ userData, adminLevel }: UserFormProps) => {
  const schema = userData?.id ? userEditSchema : userCreateSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: userData?.name || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      adminPrivileges: userData?.id
        ? userData?.adminPrivileges || false
        : true || undefined,
      adminLevel: userData?.id
        ? (userData?.adminLevel as AdminLevel) || undefined
        : undefined,
      password: userData?.id ? undefined : '',
      passwordConfirm: userData?.id ? undefined : '',
    },
  });

  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.infer<typeof schema>) => {
    startTransition(() => {
      if (userData?.id) {
        editUser(data, userData.id).then((res) => {
          if (res.error) {
            toast({
              title: t('error'),
              description: t(res.error),
              variant: 'destructive',
            });
          } else {
            toast({
              title: t('success'),
              description: t(res.success || 'userEdited'),
            });
            router.push('/admin/users');
          }
        });
        return;
      }

      createUser(data as z.infer<typeof userCreateSchema>).then((res) => {
        if (res.error) {
          toast({
            title: t('error'),
            description: t(res.error),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('success'),
            description: t(res.success || 'userCreated'),
          });
          router.push('/admin/users');
        }
      });
    });
  };

  return (
    <div className='w-full'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <div
            className={`${adminLevel === 'SUPER_ADMIN' ? 'grid grid-cols-1 gap-6 lg:grid-cols-2' : 'flex '}`}
          >
            <Card className='w-full text-start '>
              <CardHeader>
                <CardTitle>{t('userInfo')}</CardTitle>

                <CardDescription>{t('fillAllFieldsUser')}</CardDescription>
              </CardHeader>

              <CardContent className='text-start space-y-4'>
                <div className='grid grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('name')}</FormLabel>
                        <FormControl>
                          <Input
                            type='name'
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
                            type='lastName'
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
                <FormField
                  control={form.control}
                  name='email'
                  disabled={userData?.id !== undefined}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
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

                <>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='********'
                            {...field}
                            required={userData?.id === undefined}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='passwordConfirm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('confirmPassword')}</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='********'
                            {...field}
                            required={userData?.id === undefined}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              </CardContent>
            </Card>
            {adminLevel === 'SUPER_ADMIN' && (
              <div>
                <Card className='w-full '>
                  <CardHeader>
                    <CardTitle>{t('privleges')}</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='adminPrivileges'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                          <div className='space-y-0.5'>
                            <FormLabel className='text-base'>
                              {t('adminPrivleges')}
                            </FormLabel>
                            <FormDescription>
                              {t('adminPrivlegesDesc')}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='adminLevel'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('adminTier')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t('selectAdminRole')}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='ADMIN'>
                                {t('admin')}
                              </SelectItem>

                              <SelectItem value='SUPER_ADMIN'>
                                {t('superAdmin')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <div className='self-end'>
            <Button disabled={isPending} type='submit'>
              {t('submit')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
