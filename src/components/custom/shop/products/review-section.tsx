'use client';
import { Separator } from '@/components/ui/separator';
import { ReviewStars } from '../../review-stars';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ReviewSectionProps {
  reviews: {
    id: string;
    rating: number;
    comment: string;
    user: {
      name: string;
    };
    createdAt: Date;
  }[];
}

export const ReviewSection = ({ reviews }: ReviewSectionProps) => {
  const [pageSkip, setPageSkip] = useState<number>(0);

  return (
    <div className='space-y-4 flex flex-col'>
      {reviews.slice(0 + pageSkip, 3 + pageSkip).map((review) => (
        <div className='flex flex-col' key={review.id}>
          <div className='flex flex-row items-center justify-between'>
            <div className='font-medium text-lg'>John doe</div>
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
              Radit pagaisejas
            </Button>
            <Button
              variant={'outline'}
              className='self-end'
              onClick={() => {
                setPageSkip(pageSkip + 3);
              }}
              disabled={pageSkip + 3 >= reviews.length}
            >
              Radit nakamas
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
