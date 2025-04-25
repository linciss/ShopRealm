'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash } from 'lucide-react';
import { useTransition } from 'react';
import { ReviewDialog } from '../products/review-dialog';
import { deleteReview } from '../../../../actions/review/delete-review';
import { useTranslation } from 'react-i18next';

interface Review {
  id: string;
  rating: number;
  comment: string;
}

interface ReviewActionsProps {
  reviewData: Review;
}

export const ReviewActions = ({ reviewData }: ReviewActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  const { toast } = useToast();
  const handleDeleteReview = () => {
    startTransition(() => {
      deleteReview(reviewData.id).then((res) => {
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
        }
      });
    });
  };

  return (
    <div className='self-end flex gap-2'>
      <ReviewDialog reviewData={reviewData} editing={true} />
      <Button
        variant={'outline'}
        className='border-red-500 text-red-500 hover:text-red-500'
        onClick={() => {
          handleDeleteReview();
        }}
        disabled={isPending}
      >
        <Trash />
        {t('deleteReview')}
      </Button>
    </div>
  );
};
