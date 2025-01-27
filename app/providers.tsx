"use client";

import { Suspense, lazy, type ReactNode } from "react";

const LaunchDarklyProvider = lazy(() => 
  import('./components/LaunchDarklyProvider').then(mod => ({
    default: mod.LaunchDarklyProvider
  }))
);

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Suspense fallback={<>{children}</>}>
      <LaunchDarklyProvider>{children}</LaunchDarklyProvider>
    </Suspense>
  );
}
