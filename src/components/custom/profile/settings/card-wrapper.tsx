import { Card } from '@/components/ui/card';
import { CardHeaderWrapper } from './card-header';
import { ReactNode } from 'react';
import { CardContentWrapper } from './card-content';

interface CardWrapperProps {
  cardContent: ReactNode;
  cardHeader: ReactNode;
}

export const CardWrapper = ({ cardContent, cardHeader }: CardWrapperProps) => {
  return (
    <Card>
      <CardHeaderWrapper>{cardHeader}</CardHeaderWrapper>
      <CardContentWrapper>{cardContent}</CardContentWrapper>
    </Card>
  );
};
