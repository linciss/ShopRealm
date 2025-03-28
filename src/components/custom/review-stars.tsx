import { Star, StarHalf } from 'lucide-react';

interface StarProps {
  averageReview: number;
}

export const ReviewStars = ({ averageReview }: StarProps) => {
  const isDecimal = Math.floor(averageReview + 1) - averageReview <= 0.5;

  return (
    <div className='relative'>
      <div className='flex flex-row flex-nowrap items-center'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            fill='#fff'
            strokeWidth={1}
            width={15}
            className='text-gray-300'
          />
        ))}
      </div>

      <div className='flex flex-row flex-nowrap items-center absolute top-0'>
        {Array.from({ length: Math.floor(averageReview) }, (_, index) => (
          <Star
            key={index}
            fill='yellow'
            strokeWidth={0}
            width={15}
            className='text-gray-300'
          />
        ))}
        {isDecimal && (
          <StarHalf
            fill='yellow'
            strokeWidth={0}
            width={15}
            className='text-gray-300'
          />
        )}
      </div>
    </div>
  );
};
