import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ReviewSection } from '../reviews/review-section';
import { ReviewHeader } from '../reviews/review-header';
import { ReviewDialog } from './review-dialog';
import { auth } from '../../../../auth';
import initTranslations from '@/app/i18n';

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

interface MoreInfoProps {
  details: string;
  specifications: string | null;
  reviews: Review[];
  preview?: boolean;
  userReviewId?: string;
  locale: string;
}

export const MoreInfo = async ({
  details,
  specifications,
  reviews,
  preview = true,
  userReviewId,
  locale,
}: MoreInfoProps) => {
  const session = await auth();
  const { t } = await initTranslations(locale, ['productPage']);

  let filteredReviews: Review[];
  let userReviewData: Review | undefined;

  // if user review id is found then remove the review from all reviews and store as variable
  if (userReviewId) {
    userReviewData = reviews.find((rev) => rev.id === userReviewId);

    filteredReviews = userReviewData
      ? reviews.filter((rev) => rev.id !== userReviewData?.id)
      : reviews;
  } else {
    filteredReviews = reviews;
    userReviewData = undefined;
  }

  const parsedSpecifications: [] = JSON.parse(specifications || '');

  return (
    <div className='mt-5'>
      <Tabs defaultValue='details' className=' w-full'>
        <TabsList className=' space-x-1 bg-muted text-foreground w-full justify-start '>
          <TabsTrigger
            className='data-[state=active]:shadow-none rounded-none '
            value='details'
          >
            {t('productDetails')}
          </TabsTrigger>
          <TabsTrigger
            className='data-[state=active]:shadow-none rounded-none'
            value='specifications'
          >
            {t('specs')}
          </TabsTrigger>
          <TabsTrigger
            className=' data-[state=active]:shadow-none rounded-none'
            value='reviews'
          >
            {t('reviews')} ({reviews.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value='details' className='w-full space-y-20 '>
          <Card className='mt-5 '>
            <CardHeader>
              <CardTitle>{t('productDetails')}</CardTitle>
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
              <CardTitle>{t('specs')}</CardTitle>
            </CardHeader>
            <CardContent>
              {parsedSpecifications && parsedSpecifications.length > 0 ? (
                <Table>
                  <TableBody>
                    {parsedSpecifications.map(
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
                <p className='text-muted-foreground'>{t('noSpec')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='reviews'>
          <Card className='mt-5 '>
            <CardHeader className='flex flex-row gap-2 items-center'>
              <ReviewHeader reviews={reviews} t={t} />
              {!preview && session?.user.id && (
                <div className='px-4'>
                  <ReviewDialog
                    userEligibleForReview={userReviewData ? false : true}
                  />
                </div>
              )}
            </CardHeader>
            <CardContent className='space-y-4'>
              <Separator />
              <ReviewSection
                reviews={filteredReviews}
                userReviewData={userReviewData}
              />
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
