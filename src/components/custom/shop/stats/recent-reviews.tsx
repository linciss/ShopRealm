import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Star } from 'lucide-react';

interface RecentReviews {
  recentReviews: {
    id: string;
    rating: number;
    productName: string;
    userName: string;
  }[];
  t: (value: string) => string;
}

export const RecentReviews = ({ recentReviews, t }: RecentReviews) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('recentReviews')}</CardTitle>
        <CardDescription>{t('recentReviewsDesc')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {recentReviews.length > 0 ? (
          recentReviews.map((review) => {
            return (
              <div key={review.id}>
                <div className='inline-flex gap-2 items-center'>
                  <p>{review.userName} </p>
                  <div className='inline-flex gap-1 items-center'>
                    {review.rating} <Star height={12} width={12} />
                  </div>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {review.productName}
                </p>
              </div>
            );
          })
        ) : (
          <p className='text-muted-foreground'>{t('noReviews')}</p>
        )}
      </CardContent>
    </Card>
  );
};
