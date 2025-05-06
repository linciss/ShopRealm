import { NavigationBar } from '@/components/custom/navigation-bar';
import initTranslations from '../i18n';
import TranslationsProvider from '@/components/translation/translations-prover';
import Footer from '@/components/custom/footer';

const i18nNamespaces = ['productPage', 'errors', 'success', 'zod'];

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = (await params).locale;

  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <NavigationBar locale={locale} />
      {children}
      <Footer locale={locale} />
    </TranslationsProvider>
  );
}
