import { CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface CardHeaderProps {
  children: ReactNode;
}
export const CardContentWrapper = ({ children }: CardHeaderProps) => {
  return <CardContent>{children}</CardContent>;
};
