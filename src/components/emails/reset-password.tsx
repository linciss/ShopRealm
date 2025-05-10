import initTranslations from '@/app/i18n';

interface EmailLink {
  confirmLink: string;
  locale: string;
}

export const ResetPassword = async ({ confirmLink, locale }: EmailLink) => {
  const { t } = await initTranslations(locale, ['productPage']);
  return (
    <div>
      <h1>Shop Realm</h1>
      <div>
        <h2>{t('forgotPassDesc')}</h2>
        <p>ResetPassword</p>
        <a href={confirmLink}>Verificēt e-pastu</a>
      </div>
    </div>
  );
};
