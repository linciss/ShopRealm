import initTranslations from '@/app/i18n';

interface EmailLink {
  approved: boolean;
  locale: string;
}

export const StoreCreation = async ({ approved, locale }: EmailLink) => {
  const { t } = await initTranslations(locale, ['email']);
  return (
    <div>
      <h1>Shop Realm</h1>
      <div>
        <h2>{t('email:storeCreation')}</h2>
        <p>{t(approved ? 'email:success' : 'email:rejected')}</p>
      </div>
    </div>
  );
};
