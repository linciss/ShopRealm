'use client';
import { Separator } from '@/components/ui/separator';
import { ReviewStars } from '../review-stars';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ReviewActions } from './review-actions';
import { useTranslation } from 'react-i18next';

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    name: string;
    id: string;
  };
  createdAt: Date;
}

interface ReviewSectionProps {
  reviews: Review[];
  userReviewData?: Review | undefined;
}

export const ReviewSection = ({
  reviews,
  userReviewData,
}: ReviewSectionProps) => {
  const [pageSkip, setPageSkip] = useState<number>(0);
  const { t } = useTranslation();

  return (
    <div className='space-y-4 flex flex-col'>
      {userReviewData && (
        <>
          <Card>
            <CardHeader className='pb-0'>
              <div className='flex flex-row items-center justify-between'>
                <div className=''>
                  <div className='font-medium text-lg'>
                    {userReviewData.user.name}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {new Date(userReviewData.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pb-3'>
              <ReviewStars averageReview={userReviewData.rating} />
              <p className='text-md text-muted-foreground'>
                {userReviewData.comment}
              </p>
            </CardContent>
            <CardFooter className='flex-col gap-2 '>
              <Separator />
              <ReviewActions reviewData={userReviewData} />
            </CardFooter>
          </Card>
        </>
      )}

      {reviews.slice(0 + pageSkip, 3 + pageSkip).map((review) => (
        <div className='flex flex-col' key={review.id}>
          <div className='flex flex-row items-center justify-between'>
            <div className='font-medium text-lg'>
              {review.user.name === 'deletedUser'
                ? t('deletedUser')
                : review.user.name}
            </div>
            <div className='text-sm text-muted-foreground'>
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
          <ReviewStars averageReview={review.rating} />
          <p className='text-md text-muted-foreground'>{review.comment}</p>
          <Separator className='mt-1' />
        </div>
      ))}
      <div className='self-end flex gap-2'>
        {reviews.length > 0 && (
          <>
            <Button
              variant={'outline'}
              className='self-end'
              onClick={() => {
                setPageSkip(pageSkip - 3);
              }}
              disabled={pageSkip === 0}
            >
              {t('showPrev')}
            </Button>
            <Button
              variant={'outline'}
              className='self-end'
              onClick={() => {
                setPageSkip(pageSkip + 3);
              }}
              disabled={pageSkip + 3 >= reviews.length}
            >
              {t('showNext')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
