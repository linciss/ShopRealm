'use client';

import { Button } from '@/components/ui/button';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface ChangeLocaleButtonProps {
  localeChange: string;
}

export const ChangeLocaleButton = ({
  localeChange,
}: ChangeLocaleButtonProps) => {
  const params = useParams<{ locale: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLocale = () => {
    const split = pathname.split('/');

    console.log(pathname.slice(0));
    console.log(split);

    // dont allow to change to current
    if (localeChange === params.locale) return;

    // checks if not in /
    if (split.length == 2 && pathname.slice(1) !== params.locale) {
      router.push(`/${localeChange}/${split[1]}`);
    } else if (pathname.slice(1) === params.locale) {
      router.push(`/${localeChange}/${split[0]}`);
      // when 3 splits /locale/a/b
    } else if (split.length > 3 && params.locale !== 'en') {
      router.push(`/${localeChange}/${split[2]}/${split[3]}`);
      // when 3 splits but since en isnt showing up so have to handle it /locale/a/b
    } else if (split.length === 3 && params.locale === 'en') {
      router.push(`/${localeChange}/${split[1]}/${split[2]}`);
    } else {
      router.push(`/${localeChange}/${split[2]}`);
    }
  };

  return (
    <>
      <Button className='!p-0' variant={'link'} onClick={handleChangeLocale}>
        {t(localeChange)}
      </Button>
    </>
  );
};
