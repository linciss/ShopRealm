import { CardHeader } from '@/components/ui/card';
import { ReactNode } from 'react';

interface CardHeaderProps {
  children: ReactNode;
}
export const CardHeaderWrapper = ({ children }: CardHeaderProps) => {
  return <CardHeader>{children}</CardHeader>;
};
