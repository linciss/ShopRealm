'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { reviewSchema } from './../../../../schemas/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Star } from 'lucide-react';
import { useState, useTransition } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { addReview } from '../../../../actions/review/add-review';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { editReview } from '../../../../actions/review/edit-review';
import { useTranslation } from 'react-i18next';

interface Review {
  id: string;
  rating: number;
  comment: string;
}

interface ReviewDialogProps {
  userEligibleForReview?: boolean;
  reviewData?: Review;
  editing?: boolean;
}

export const ReviewDialog = ({
  userEligibleForReview = false,
  reviewData,
  editing = false,
}: ReviewDialogProps) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const [rating, setRating] = useState<number>(reviewData?.rating || 0);
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: reviewData?.rating || 0,
      comment: reviewData?.comment || '',
    },
  });

  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  const { toast } = useToast();

  const onSubmit = (data: z.infer<typeof reviewSchema>) => {
    if (!editing) {
      startTransition(() => {
        addReview(data, params.id).then((res) => {
          if (res.error) {
            toast({
              title: t('error'),
              description: t(`errors:${res.error}`),
              variant: 'destructive',
            });
          } else {
            toast({
              title: t('success'),
              description: t(`success:${res.success}`),
            });
            setOpen(false);
          }
        });
      });
    } else {
      startTransition(() => {
        editReview(data, reviewData?.id as string).then((res) => {
          if (res.error) {
            toast({
              title: t('error'),
              description: t(`errors:${res.error}`),
              variant: 'destructive',
            });
          } else {
            toast({
              title: t('success'),
              description: t(`success:${res.success}`),
            });
            setOpen(false);
          }
        });
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={`${!editing ? 'default' : 'outline'}`}
          disabled={!userEligibleForReview && !editing}
        >
          {editing && <Edit />}
          {!editing ? t('writeReview') : t('editReview')}
        </Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-[425px]'
        aria-describedby='Review dialog'
      >
        <DialogHeader>
          <DialogTitle>{t('review')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-4 py-4'>
              <div className=''>
                <div className='flex flex-col w-full gap-2'>
                  <FormField
                    control={form.control}
                    name='rating'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('reviewRating')}</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <div className='flex flex-row flex-nowrap items-center'>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  className='focus:outline-none'
                                  type='button'
                                  onMouseEnter={() => {
                                    setHoverRating(star);
                                  }}
                                  onMouseLeave={() => {
                                    setHoverRating(0);
                                  }}
                                  onMouseDown={() => {
                                    setRating(star);
                                    field.onChange(star);
                                  }}
                                >
                                  <Star
                                    className={`h-8 w-8 ${
                                      star <= (hoverRating || rating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className=''>
                <FormField
                  control={form.control}
                  name='comment'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('reviewComment')}</FormLabel>
                      <FormControl>
                        <Input placeholder='...' {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button disabled={isPending} type='submit'>
                {t('submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
