'use client';

import { useFieldArray, useForm } from 'react-hook-form';
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

import { productSchema } from '../../../../../schemas';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { redirect } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  isActive: boolean;
  image: File | undefined;
  category: string[];
  details: string;
  specifications: object[];
}

interface ProductDataProps {
  productData?: Product | null;
}

export const ProductForm = ({ productData }: ProductDataProps) => {
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: productData?.name || '',
      description: productData?.description || '',
      price: productData?.price || 0.0,
      quantity: productData?.quantity || 1,
      isActive: productData?.isActive || true,
      image: productData?.image || undefined,
      category: productData?.category || [],
      details: productData?.details || '',
      specifications: productData?.specifications || [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file as File);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { toast } = useToast();

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'specifications',
  });

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    const imgString = await convertToBase64(data.image as File);

    const finalData = {
      ...data,
      image: imgString as string,
    };

    startTransition(() => {
      if (productData?.id) {
        console.log('editing!');
      }

      createProduct(finalData).then((res) => {
        if (res?.error) {
          toast({
            title: 'Kluda!',
            description: res.error,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Izveidots!',
            description: res.success,
            variant: 'default',
          });
          redirect('/store/products');
        }
      });
    });
  };

  return (
    <>
      <div className='w-full'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
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
                        <FormLabel>Preces arpaksts</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Mazs apraksts par preci.......'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Sis arpaksts radisies, kad kads mekles tavu produktu,
                          ka ari produktu lapa
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='details'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preces detaļas</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder='Ievadiet produkta detalas...'
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
                                  field.onChange(
                                    Number.parseInt(e.target.value),
                                  )
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

              <div className='flex flex-col w-full gap-4'>
                {/* 2nd CARD */}

                <Card className='w-full p-8 text-start space-y-4'>
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
                      name='image'
                      render={({
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        field: { value, onChange, ...fieldProps },
                      }) => (
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
                                        form.setValue(
                                          'image',
                                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                          undefined as any,
                                        );
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
                </Card>
                <Card className='w-full p-8 text-start space-y-4 h-full'>
                  <CardTitle className='flex flex-col gap-2'>
                    <h2 className='text-2xl font-semibold leading-none tracking-tight'>
                      Produkta specifikacijas
                    </h2>
                    <p className='text-sm font-normal text-muted-foreground'>
                      iedod specifikacijas savam produktam
                    </p>
                  </CardTitle>
                  <CardContent className='p-0 text-start space-y-4'>
                    <div className='space-y-4'>
                      {fields.map((field, index) => (
                        <div key={field.id} className='flex items-end gap-2'>
                          <FormField
                            control={form.control}
                            name={`specifications.${index}.key`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <FormLabel
                                  className={
                                    index !== 0 ? 'sr-only' : undefined
                                  }
                                >
                                  specifikacijas nosaukums
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Smagums, Dimensija, Baterija...'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`specifications.${index}.value`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <FormLabel
                                  className={
                                    index !== 0 ? 'sr-only' : undefined
                                  }
                                >
                                  Specifikacijas vertiba
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='500g, 10x15x2cm, 40h...'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            onClick={() => remove(index)}
                            disabled={index === 0 && fields.length === 1}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='mt-2'
                        onClick={() => append({ key: '', value: '' })}
                      >
                        <Plus className='mr-2 h-4 w-4' />
                        Pievienot specifikaciju
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className='w-full p-8 text-start space-y-4 h-full'>
                  <CardTitle className='flex flex-col gap-2'>
                    <h2 className='text-2xl font-semibold leading-none tracking-tight'>
                      Produkta katoegirjas
                    </h2>
                    <p className='text-sm font-normal text-muted-foreground'>
                      Iedsod kateogriju produktam
                    </p>
                  </CardTitle>
                  <CardContent className='p-0 text-start space-y-4'>
                    <FormField
                      control={form.control}
                      name='category'
                      render={() => (
                        <FormItem className='space-y-1'>
                          <div className='mb-4'>
                            <FormLabel className='text-lg font-semibold leading-none tracking-tight'>
                              Kategorijas
                            </FormLabel>
                            <FormDescription>
                              Izvelies vismaz vienu kategoriju
                            </FormDescription>
                          </div>
                          {items.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name='category'
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className='flex flex-row items-start space-x-3 space-y-0'
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className='text-sm font-normal'>
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className='self-end space-x-4'>
              <Link href={'/store/products'}>
                <Button variant={'outline'}>Atcelt</Button>
              </Link>

              <Button type='submit' className='' disabled={isPending}>
                {isPending ? 'Veidošana...' : 'Izveidot!'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

const items = [
  {
    id: 'electronics',
    label: 'Elektronika',
  },
  {
    id: 'clothing',
    label: 'Apgerbs',
  },
  {
    id: 'home',
    label: 'Majas un virtuve',
  },
  {
    id: 'beauty',
    label: 'Veseliba un skaistums',
  },
  {
    id: 'sports',
    label: 'Sports un atputa',
  },
  {
    id: 'toys',
    label: 'Rotaļlietas un spēles',
  },
  {
    id: 'books',
    label: 'Gramatas un mediji',
  },
  {
    id: 'health',
    label: 'Veseliba un labklajiba',
  },
  {
    id: 'automotive',
    label: 'Auto un motocikli',
  },
  {
    id: 'jewelry',
    label: 'Rotaslietas un aksesuari',
  },
];
