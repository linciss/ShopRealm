import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

interface PersonalInformationProps {
  children: React.ReactNode;
  cardTitle: string;
}

export const PersonalInformation = async ({
  children,
  cardTitle,
}: PersonalInformationProps) => {
  return (
    <div className='mt-2 w-full border-primary'>
      <Card className='p-1  shadow-lg'>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};
