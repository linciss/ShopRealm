import { calculateAverageRating } from '@/lib/utils';
import { ReviewStars } from '../review-stars';

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    name: string;
  };
  createdAt: Date;
}

interface ReviewHeaderProps {
  reviews: Review[];
  t: (value: string) => string;
}

export const ReviewHeader = ({ reviews, t }: ReviewHeaderProps) => {
  const reviewCount = reviews.length;
  const calculatePercentage = (rating: number) => {
    return (
      Math.round(
        (reviews.filter((rev) => rev.rating === rating).length / reviewCount) *
          100 *
          10,
      ) / 10
    );
  };

  return (
    <>
      <div className='flex flex-col justify-center items-center'>
        <h3 className='text-xl font-semibold'>
          {calculateAverageRating(reviews)}
        </h3>
        <ReviewStars averageReview={calculateAverageRating(reviews)} />
        <p className='text-sm text-muted-foreground'>
          {reviews.length}{' '}
          {reviews.length === 1 ? t('reviewStat') : t('reviewStats')}
        </p>
      </div>
      <div className='flex-1'>
        <ul>
          {[5, 4, 3, 2, 1].map((rating) => (
            <li
              className='flex flex-row items-center gap-2'
              key={`rating-${rating}-count-${reviewCount}`}
            >
              {rating}
              <div className='w-full bg-muted rounded-full h-2 relative'>
                <div
                  className={`rounded-full absolute top-0 h-2 bg-yellow-500`}
                  style={{
                    width: calculatePercentage(rating) + '%',
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
