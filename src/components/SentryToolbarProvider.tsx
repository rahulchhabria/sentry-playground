'use client';

import { useSentryToolbar } from '../hooks/useSentryToolbar';

export function SentryToolbarProvider({ children }: { children: React.ReactNode }) {
  useSentryToolbar({
    organizationSlug: 'rc-sentry-projects',
    projectIdOrSlug: 'bolt-sentry-simulator',
  });

  return <>{children}</>;
} 