import Link from 'next/link';
import { Button } from '../ui/button';

interface TypeButtonProps {
  text: string;
  href: string;
}
export const TypeButton = ({ text, href }: TypeButtonProps) => {
  return (
    <Button variant={'link'}>
      <Link href={href} className='text-foreground sm:text-sm text-xs'>
        {text}
      </Link>
    </Button>
  );
};
