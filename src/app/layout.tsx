import type { Metadata } from 'next';
import { Open_Sans, Sofia_Sans_Condensed } from 'next/font/google';

import { FeedbackWidget } from '@/components/feedback-widget';
import { Provider } from '@/components/provider';
import { Toaster } from '@/components/toaster';

const openSans = Open_Sans({
  subsets: ['latin', 'cyrillic'],
  display: 'optional',
  variable: '--font-open-sans',
  preload: true,
});

const sofiaSansCondensed = Sofia_Sans_Condensed({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  display: 'optional',
  variable: '--font-sofia-sans-condensed',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Wordi',
  description: 'Learn German with Wordi',
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openSans.variable} ${sofiaSansCondensed.variable}`}
    >
      <body suppressHydrationWarning>
        <Provider>
          {children}
          <Toaster />
        </Provider>
        <FeedbackWidget />
      </body>
    </html>
  );
};

export default RootLayout;
