'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

interface SentryToolbarProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  config?: {
    organizationSlug: string;
    projectIdOrSlug: string;
  };
}

export function SentryToolbarProvider({ 
  children, 
  enabled = true,
  config = {
    organizationSlug: 'buildwithcode',
    projectIdOrSlug: 'breakpoint',
  }
}: SentryToolbarProviderProps) {
  useEffect(() => {
    if (!enabled) return;
    
    // Initialize toolbar after script loads
    if (window.SentryToolbar) {
      window.SentryToolbar.init(config);
    }
  }, [enabled, config]);

  return (
    <>
      {enabled && (
        <Script
          src="https://browser.sentry-cdn.com/sentry-toolbar/latest/toolbar.min.js"
          strategy="lazyOnload"
          data-sentry-toolbar="true"
        />
      )}
      {children}
    </>
  );
}