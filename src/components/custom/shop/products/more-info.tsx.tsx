import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewStars } from '../../review-stars';

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
  console.log(specifications);

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
                          className=' border-b border-muted'
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
                <h3 className='text-xl font-semibold'>4.5</h3>
                <ReviewStars averageReview={4.5} />
                <p className='text-sm text-muted-foreground'>24 reviews</p>
              </div>
              <div className='flex-1'>
                {/*  STATS */}
                <ul>
                  <li>1</li>
                  <li>2</li>
                  <li>3</li>
                  <li>4</li>
                  <li>5</li>
                </ul>
              </div>
            </CardHeader>
            <CardContent></CardContent>
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
