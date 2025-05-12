'use client';
import { useTranslation } from 'react-i18next';
import { CardWrapper } from './card-wrapper';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { ChangeLocaleButton } from './change-locale-button';

export const ChangeLocale = () => {
  const { t } = useTranslation();
  return (
    <CardWrapper
      cardHeader={
        <>
          <CardTitle>{t('changeLocale')}</CardTitle>
          <CardDescription>{t('changeLocaleDesc')}</CardDescription>
        </>
      }
      cardContent={
        <>
          <ChangeLocaleButton />
        </>
      }
    />
  );
};
