import Link from 'next/link';
import { Button } from '../ui/button';

interface TypeButtonProps {
  text: string;
  href: string;
}
export const TypeButton = ({ text, href }: TypeButtonProps) => {
  return (
    <Button variant={'link'} aria-label='Auth type'>
      <Link
        href={href}
        className='text-foreground sm:text-sm text-xs'
        aria-label='Auth type'
      >
        {text}
      </Link>
    </Button>
  );
};
