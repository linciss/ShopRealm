'use client';
import { useTranslation } from 'react-i18next';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { CardWrapper } from '../../profile/settings/card-wrapper';
import { DeleteAccountDialog } from '../../delete-account-dialog';

export const DangerZone = () => {
  const { t } = useTranslation();
  return (
    <CardWrapper
      cardHeader={
        <>
          <CardTitle>{t('dangerZone')}</CardTitle>
          <CardDescription>{t('deleteStoreDesc')}</CardDescription>
        </>
      }
      cardContent={
        <>
          <DeleteAccountDialog store={true} />
        </>
      }
    />
  );
};
