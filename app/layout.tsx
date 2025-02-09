import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Suspense } from 'react';
import { SpotlightInitializer } from './components/SpotlightInitializer';
import { Toaster } from "sonner";
import * as Sentry from "@sentry/nextjs";

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
});

// Initialize Sentry feedback widget
if (typeof window !== 'undefined') {
  Sentry.init({
    dsn: "https://891119ef51d56b1a8c9193f32047d068@o4506312335294464.ingest.us.sentry.io/4508672160628736",
  });
}

export const metadata: Metadata = {
  title: 'Error Testing Playground',
  description: 'Test error monitoring, performance tracking, and release management features',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
          crossOrigin="anonymous"
        />
        <link 
          rel="preload" 
          href="https://browser.sentry-cdn.com" 
          as="script"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Suspense fallback={
          <div className="min-h-screen bg-[#11121D] flex items-center justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        }>
          <Providers>{children}</Providers>
        </Suspense>
        <SpeedInsights />
        <SpotlightInitializer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
