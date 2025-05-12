import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Header } from './header';
import { TypeButton } from './type-button';

interface CardWrapperProps {
  children: React.ReactNode;
  formType: string;
  label: string;
  footerText: string;
  footerUrl: string;
}

export const CardWrapper = ({
  children,
  formType,
  label,
  footerText,
  footerUrl,
}: CardWrapperProps) => {
  return (
    <Card className='md:max-w-[450px] shadow-md'>
      <CardHeader className='text-center'>
        <Header formType={formType} label={label} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <TypeButton text={footerText} href={footerUrl} />
      </CardFooter>
    </Card>
  );
};
