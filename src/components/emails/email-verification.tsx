import initTranslations from '@/app/i18n';

interface EmailLink {
  confirmLink: string;
  locale: string;
}

export const EmailVerification = async ({ confirmLink, locale }: EmailLink) => {
  const { t } = await initTranslations(locale, ['email']);
  return (
    <div>
      <h1>Shop Realm</h1>
      <div>
        <h2>{t('verifyEmail')}</h2>
        <p>{t('verifyEmailText')}</p>
        <a href={confirmLink}>{t('verifyEmail')}</a>
      </div>
    </div>
  );
};
