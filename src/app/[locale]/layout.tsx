import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { NavigationBar } from '@/components/custom/navigation-bar';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { auth } from '../../../auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/custom/footer';
import initTranslations from '../i18n';
import TranslationsProvider from '@/components/translation/translations-prover';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  applicationName: 'Shop Realm',
  keywords: ['Shop Realm', 'ShopRealm', 'shopRealm', 'shop realm'],
  creator: 'Linards',
  title: 'Shop Realm',
  description:
    'Shop Realm is a place where you can shop for anything you want. From electronics to clothes, we have it all.',
};
const i18nNamespaces = ['productPage', 'errors'];

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const session = await auth();
  const locale = (await params).locale;

  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <div className='relative flex min-h-screen flex-col bg-background'>
              <SessionProvider session={session}>
                <NavigationBar />
                <div className='flex-1'>{children}</div>
                <Footer />
              </SessionProvider>
            </div>
            <Toaster />
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
