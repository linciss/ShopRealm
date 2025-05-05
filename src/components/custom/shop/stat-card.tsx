import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
  name?: string;
  value?: string | number;
  description?: string;
  icon?: ReactNode;
}

export const StatCard = async ({
  name,
  value,
  description,
  icon,
}: StatCardProps) => {
  return (
    <Card className='rounded-lg'>
      <CardHeader className='pb-3'>
        <span className='text-sm flex justify-between items-center'>
          <span>{name}</span> {icon}
        </span>
      </CardHeader>
      <CardContent className='flex flex-col'>
        <span className='text-xl font-bold'>{value}</span>
        <span className='text-sm text-muted-foreground'>{description}</span>
      </CardContent>
    </Card>
  );
};
