import initTranslations from '@/app/i18n';

interface EmailLink {
  confirmLink: string;
  locale: string;
  name: string;
}

export const ProductSale = async ({ confirmLink, locale, name }: EmailLink) => {
  const { t } = await initTranslations(locale, ['email']);
  return (
    <div>
      <h1>Shop Realm</h1>
      <div>
        <h2>
          {name} {t('email:favOnSale')}
        </h2>
        <p>{t('email:toVisit')}</p>
        <a href={confirmLink}>{t('visitProduct')}</a>
      </div>
    </div>
  );
};
