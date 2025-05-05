'use client';
import { useTranslation } from 'react-i18next';
import { DeleteAccountDialog } from '../../delete-account-dialog';
import { CardWrapper } from './card-wrapper';
import { CardDescription, CardTitle } from '@/components/ui/card';

export const AccountDelete = () => {
  const { t } = useTranslation();
  return (
    <CardWrapper
      cardHeader={<CardTitle>{t('dangerZone')}</CardTitle>}
      cardContent={
        <>
          <CardDescription>{t('deleteAccountDesc')}</CardDescription>
          <DeleteAccountDialog />
        </>
      }
    />
  );
};
