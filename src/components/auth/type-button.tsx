import Link from 'next/link';
import { Button } from '../ui/button';

interface TypeButtonProps {
  text: string;
  href: string;
}
export const TypeButton = ({ text, href }: TypeButtonProps) => {
  return (
    <Button variant={'link'}>
      <Link href={href}>{text}</Link>
    </Button>
  );
};
