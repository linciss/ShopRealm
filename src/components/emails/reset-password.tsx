import initTranslations from '@/app/i18n';

interface EmailLink {
  confirmLink: string;
  locale: string;
}

export const ResetPassword = async ({ confirmLink, locale }: EmailLink) => {
  const { t } = await initTranslations(locale, ['email']);
  return (
    <div>
      <h1>Shop Realm</h1>
      <div>
        <h2>{t('email:resetPassword')}</h2>
        <p>{t('email:resetPasswordText')}</p>
        <a href={confirmLink}>{t('resetPassword')}</a>
      </div>
    </div>
  );
};
