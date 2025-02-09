import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Suspense } from 'react';
import { SpotlightInitializer } from './components/SpotlightInitializer';
import { Toaster } from "sonner";
import * as Sentry from "@sentry/nextjs";

// Initialize Sentry feedback widget
if (typeof window !== 'undefined') {
  Sentry.init({
    dsn: "https://891119ef51d56b1a8c9193f32047d068@o4506312335294464.ingest.us.sentry.io/4508672160628736",
  });
}

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Ensure text remains visible during webfont load
  preload: true
});

export const metadata: Metadata = {
  title: 'Sentry Playground',
  description: 'A testing ground for error monitoring and performance tracking features',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const themeColor = '#ffffff';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify Sentry is initialized
  console.log("Sentry initialized:", {
    enabled: Sentry.getCurrentHub().getClient()?.getOptions().enabled,
    dsn: Sentry.getCurrentHub().getClient()?.getOptions().dsn,
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
        <SpeedInsights />
        <SpotlightInitializer />
        <Toaster />
      </body>
    </html>
  );
}
