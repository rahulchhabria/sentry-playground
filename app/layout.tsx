import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { SentryToolbarProvider } from '../src/components/SentryToolbarProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Suspense } from 'react';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Ensure text remains visible during webfont load
  preload: true
});

export const metadata: Metadata = {
  title: 'Sentry Playground',
  description: 'A testing ground for Sentry error monitoring and performance tracking features',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://app.launchdarkly.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <SentryToolbarProvider>
            <Providers>{children}</Providers>
          </SentryToolbarProvider>
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  );
}
