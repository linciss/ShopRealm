import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye } from 'lucide-react';

export const StatCard = async () => {
  return (
    <Card className='rounded-lg'>
      <CardHeader className='pb-3'>
        <span className='text-sm flex justify-between'>
          <span>Skatijumi</span> <Eye />
        </span>
      </CardHeader>
      <CardContent className='flex flex-col'>
        <span className='text-xl font-bold'>120</span>
        <span className='text-sm text-muted-foreground'>Tavi skatijumi</span>
      </CardContent>
    </Card>
  );
};
