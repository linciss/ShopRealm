import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Header } from './header';

interface CardWrapperProps {
  children: React.ReactNode;
  formType: string;
  label: string;
}

export const CardWrapper = ({
  children,
  formType,
  label,
}: CardWrapperProps) => {
  return (
    <Card className='w-[400px] shadow-md'>
      <CardHeader className='text-center'>
        <Header formType={formType} label={label} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
