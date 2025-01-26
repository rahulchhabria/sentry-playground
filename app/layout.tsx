import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { SentryToolbarProvider } from '../src/components/SentryToolbarProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sentry Playground',
  description: 'A testing ground for Sentry error monitoring and performance tracking features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
<SentryToolbarProvider>
<Providers>{children}</Providers>
</SentryToolbarProvider>
<SpeedInsights />
      </body>
    </html>
  );
}
