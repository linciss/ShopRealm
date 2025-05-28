/* eslint-disable @next/next/no-img-element */
import initTranslations from '@/app/i18n';

interface OrderConfirmationProps {
  locale: string;
  orderId: string;
}
export const OrderConfirmation = async ({
  locale,
  orderId,
}: OrderConfirmationProps) => {
  const { t } = await initTranslations(locale, ['email']);
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1>Shop Realm</h1>
      <div>
        <h2>{t('orderPlaced')}</h2>
        <p>{t('orderPlacedDesc')}</p>
        <p>
          {t('orderNr')}: {orderId}
        </p>
      </div>
    </div>
  );
};
