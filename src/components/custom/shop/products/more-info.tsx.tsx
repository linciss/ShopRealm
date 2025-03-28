import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewStars } from '../../review-stars';
import { Separator } from '@/components/ui/separator';
import { ReviewSection } from './review-section';

const mockupReviews = [
  {
    id: '1',
    rating: 4,
    comment: 'Labas kvalitates prece, atbilst aprakstam 1',
    user: {
      name: 'John Doe',
    },
    createdAt: new Date(),
  },
  {
    id: '2',
    rating: 5,
    comment: 'Labas kvalitates prece, atbilst aprakstam 2',
    user: {
      name: 'John Doe',
    },
    createdAt: new Date(),
  },
  {
    id: '3',
    rating: 3,
    comment: 'Labas kvalitates prece, atbilst aprakstam 3',
    user: {
      name: 'John Doe',
    },
    createdAt: new Date(),
  },
  {
    id: '4',
    rating: 2,
    comment: 'Labas kvalitates prece, atbilst aprakstam 4',
    user: {
      name: 'John Doe',
    },
    createdAt: new Date(),
  },
  {
    id: '5',
    rating: 1,
    comment: 'Labas kvalitates prece, atbilst aprakstam 5',
    user: {
      name: 'John Doe',
    },
    createdAt: new Date(),
  },
  {
    id: '6',
    rating: 5,
    comment: 'Labas kvalitates prece, atbilst aprakstam 6',
    user: {
      name: 'John Doe',
    },
    createdAt: new Date(),
  },
  {
    id: '7',
    rating: 4,
    comment: 'Labas kvalitates prece, atbilst aprakstam 7',
    user: {
      name: 'John Doe',
    },
    createdAt: new Date(),
  },
  {
    id: '8',
    rating: 3,
    comment: 'Labas kvalitates prece, atbilst aprakstam 8 ',
    user: {
      name: 'John Doe',
    },
    createdAt: new Date(),
  },
  {
    id: '9',
    rating: 3,
    comment: 'Labas kvalitates prece, atbilst aprakstam 9',
    user: {
      name: 'John Doe',
    },
    createdAt: new Date(),
  },
  {
    id: '9',
    rating: 3,
    comment: 'Labas kvalitates prece, atbilst aprakstam 10',
    user: {
      name: 'John Doe',
    },
    createdAt: new Date(),
  },
];

interface MoreInfoProps {
  details: string;
  specifications: string | null;
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

export const MoreInfo = ({
  details,
  specifications,
  reviews,
}: MoreInfoProps) => {
  const reviewCount = mockupReviews.length;

  const avgRating =
    Math.round(
      (mockupReviews
        .map((review) => {
          return review.rating;
        })
        .reduce((sum, rating) => sum + rating, 0) /
        reviewCount) *
        10,
    ) / 10;

  const calculatePercentage = (rating: number) => {
    return (
      Math.round(
        (mockupReviews.filter((rev) => rev.rating === rating).length /
          reviewCount) *
          100 *
          10,
      ) / 10
    );
  };

  return (
    <div className='mt-5'>
      <Tabs defaultValue='details' className=' w-full'>
        <TabsList className=' space-x-2 bg-muted text-foreground '>
          <TabsTrigger
            className='data-[state=active]:shadow-none rounded-none'
            value='details'
          >
            Produkta detalas
          </TabsTrigger>
          <TabsTrigger
            className='data-[state=active]:shadow-none rounded-none'
            value='specifications'
          >
            Specifikacijas
          </TabsTrigger>
          <TabsTrigger
            className=' data-[state=active]:shadow-none rounded-none'
            value='reviews'
          >
            Atsauksmes ({reviews.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value='details' className='w-full space-y-20 '>
          <Card className='mt-5 '>
            <CardHeader>
              <h3 className='text-xl font-semibold'>Produkta detalas</h3>
            </CardHeader>
            <CardContent>
              <div
                className='text-container'
                dangerouslySetInnerHTML={{ __html: details }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='specifications'>
          <Card className='mt-5'>
            <CardHeader>
              <h3 className='text-xl font-semibold'>Produkta specifikacija</h3>
            </CardHeader>
            <CardContent>
              {specifications && specifications.length > 0 ? (
                <Table>
                  <TableBody>
                    {JSON.parse(specifications).map(
                      (specification: Specification) => (
                        <TableRow
                          key={specification.key}
                          className='!border-b !border-muted'
                        >
                          <TableCell className='w-1/2 flex flex-row justify-between items-center px-0'>
                            <p className='font-medium'>{specification.key}</p>
                            <p className='font-medium'>{specification.value}</p>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              ) : (
                <p className='text-muted-foreground'>
                  Nav tehniskas specifikacijas
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='reviews'>
          <Card className='mt-5 '>
            <CardHeader className='flex flex-row gap-2'>
              <div className='flex flex-col justify-center items-center'>
                <h3 className='text-xl font-semibold'>{avgRating}</h3>
                <ReviewStars averageReview={avgRating} />
                <p className='text-sm text-muted-foreground'>
                  {reviews.length} atsauksmes
                </p>
              </div>
              <div className='flex-1'>
                <ul>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <li
                      className='flex flex-row items-center gap-2'
                      key={rating}
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
            </CardHeader>
            <CardContent className='space-y-4'>
              <Separator />
              <ReviewSection reviews={mockupReviews} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface Specification {
  key: string;
  value: string;
}
