import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Check } from 'lucide-react';

interface FormSuccessProps {
  message: string | undefined;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  return (
    <Alert variant={'default'} className='border-green-500 text-green-500 '>
      <Check className='h-4 w-4 !text-green-500' />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
