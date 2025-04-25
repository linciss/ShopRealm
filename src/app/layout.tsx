import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { SessionProvider } from 'next-auth/react';
import { NavigationBar } from '@/components/custom/navigation-bar';
import Footer from '@/components/custom/footer';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '../../auth';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const session = await auth();
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
      </body>
    </html>
  );
}
