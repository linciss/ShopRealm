'use client';

import { CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const locales = [
  {
    value: 'en',
  },
  {
    value: 'lv',
  },
  {
    value: 'fr',
  },
];

export const ChangeLocaleButton = () => {
  const params = useParams<{ locale: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLocale = (value: string) => {
    const split = pathname.split('/');

    if (split.length == 2) {
      router.push(`/${value}/${pathname}`);
    } else {
      router.push(`/${value}/${split[2]}`);
    }
  };

  return (
    <>
      <Select
        onValueChange={handleChangeLocale}
        defaultValue={params.locale || 'en'}
      >
        <SelectTrigger>
          <SelectValue
            defaultValue={params.locale || 'en'}
            placeholder={t('selectLanguage')}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('languages')}</SelectLabel>
            {locales.map((locale) => (
              <SelectItem key={locale.value} value={locale.value}>
                {t(locale.value)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <CardDescription className='mt-1'>{t('localeInfo')}</CardDescription>
    </>
  );
};
