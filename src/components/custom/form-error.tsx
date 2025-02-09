import { ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface FormErrorProps {
  message: string | undefined;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <Alert variant='destructive'>
      <ShieldAlert className='h-4 w-4' />
      <AlertTitle>Kļūda</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
