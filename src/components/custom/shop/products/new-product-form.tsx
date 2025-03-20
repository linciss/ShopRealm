'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
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
import { useState, useTransition } from 'react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { createProduct } from '../../../../../actions/create-product';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
// import Image from 'next/image';
// import { Upload, X } from 'lucide-react';
import { productSchema } from '../../../../../schemas';

export const NewProductForm = () => {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  // const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0.0,
      quantity: 1,
      isActive: true,
      // image: undefined,
      category: [''],
    },
  });

  // function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     form.setValue('image', e.target.files as FileList);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      createProduct(data).then((res) => {
        if (res?.error) {
          setError(res?.error);
        } else {
          setSuccess(res?.success);
        }
      });
    });
  };

  return (
    <>
      {error && (
        <div className='bg-destructive/10 text-destructive p-3 rounded-md mb-4'>
          {error}
        </div>
      )}
      {success && (
        <div className='bg-green-500/10 text-green-500 p-3 rounded-md mb-4'>
          {success}
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col  mt-4 w-full'
        >
          <div className='grid grid-cols-2 gap-4'>
            <Card className='w-full p-8 text-start space-y-4'>
              <CardTitle className='flex flex-col gap-2'>
                <h2 className='text-2xl font-semibold leading-none tracking-tight'>
                  Produkta informacija
                </h2>
                <p className='text-sm font-normal text-muted-foreground'>
                  Aizpildi visus laukus, lai izveidotu savu produktu.
                </p>
              </CardTitle>
              <CardContent className='p-0 text-start space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preces Nosaukums</FormLabel>
                      <FormControl>
                        <Input placeholder='Iphone 14 Pro' {...field} />
                      </FormControl>
                      <FormDescription>
                        Sis vards radisies klietniem
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
                      <FormLabel>Preces deskripicja</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Ievadiet produkta aprakstu...'
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex flex-row gap-4 justify-between'>
                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='price'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cena</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <span className='absolute left-3 top-0 bottom-0  translate-y-[20%]'>
                                €
                              </span>
                              <Input
                                type='number'
                                step='1'
                                placeholder='0.00'
                                {...field}
                                className='pl-7'
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value),
                                  )
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name='quantity'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Daudzums</FormLabel>
                          <FormControl>
                            <Input
                              prefix='$'
                              type='number'
                              placeholder='1'
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name='isActive'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Produkta redamiba
                        </FormLabel>
                        <FormDescription>
                          Paradi vai paslep so produktu no pircejiem
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
              </CardContent>
            </Card>

            <div className='flex flex-col w-full '>
              {/* 2nd CARD */}

              {/* <Card className='w-full p-8 text-start space-y-4'>
                <CardTitle className='flex flex-col gap-2'>
                  <h2 className='text-2xl font-semibold leading-none tracking-tight'>
                    Produkta bilde
                  </h2>
                  <p className='text-sm font-normal text-muted-foreground'>
                    Paradi ka izstas tavs produkts
                  </p>
                </CardTitle>
                <CardContent className='p-0 text-start space-y-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <div className='space-y-4'>
                            <div
                              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center ${
                                imagePreview
                                  ? 'border-muted'
                                  : 'border-primary/50'
                              }`}
                            >
                              {imagePreview ? (
                                <div className='relative w-full'>
                                  <Image
                                    width={566}
                                    height={140}
                                    src={imagePreview || '/placeholder.svg'}
                                    alt='Product preview'
                                    className='mx-auto max-h-[200px] object-contain rounded-md'
                                  />
                                  <Button
                                    type='button'
                                    variant='destructive'
                                    size='icon'
                                    className='absolute top-2 right-2 h-8 w-8'
                                    onClick={() => {
                                      setImagePreview(null);
                                      form.setValue('image', undefined as any);
                                    }}
                                  >
                                    <X className='h-4 w-4' />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Upload className='h-10 w-10 text-muted-foreground mb-2' />
                                  <div className='text-sm text-muted-foreground'>
                                    <label
                                      htmlFor='image-upload'
                                      className='font-medium text-primary hover:underline cursor-pointer'
                                    >
                                      Spied lai pievienotu
                                    </label>{' '}
                                  </div>
                                  <p className='text-xs text-muted-foreground mt-1'>
                                    JPG, PNG or WebP (maksimali 5MB)
                                  </p>
                                </>
                              )}
                            </div>
                            <Input
                              id='image-upload'
                              type='file'
                              accept='image/jpeg,image/jpg,image/png,image/webp'
                              className='hidden'
                              onChange={handleImageChange}
                              {...fieldProps}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card> */}
            </div>
          </div>
          <div className='self-end space-x-4 mt-8 '>
            <Link href={'/store/items'}>
              <Button variant={'outline'}>Atcelt</Button>
            </Link>

            <Button type='submit' className='' disabled={isPending}>
              {isPending ? 'Veidošana...' : 'Izveidot!'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
