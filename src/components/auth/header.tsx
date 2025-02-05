import { CardDescription, CardTitle } from '../ui/card';

interface HeaderProps {
  formType: string;
  label: string;
}

export const Header = ({ formType, label }: HeaderProps) => {
  return (
    <>
      <CardTitle>{formType}</CardTitle>
      <CardDescription>{label}</CardDescription>
    </>
  );
};
