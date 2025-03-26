import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavigationBar } from '@/components/custom/navigation-bar';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { auth } from '../../auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  applicationName: 'Shop Sphere',
  keywords: ['Shop Sphere', 'ShopSphere', 'shopSphere', 'shop sphere'],
  creator: 'Linards',
  title: 'Shop Sphere',
  description:
    'Shop Sphere is a place where you can shop for anything you want. From electronics to clothes, we have it all.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
            </SessionProvider>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
