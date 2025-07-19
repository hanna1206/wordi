import type { Metadata } from 'next';
import { Onest } from 'next/font/google';

import { FeedbackWidget } from '@/components/feedback-widget';
import { Provider } from '@/components/provider';
import { Toaster } from '@/components/toaster';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-onest',
});

export const metadata: Metadata = {
  title: 'Wordi',
  description: 'Learn German with Wordi',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning className={onest.variable}>
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
