"use client";

import { asyncWithLDProvider, LDClient } from "launchdarkly-react-client-sdk";
import { ReactNode, useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import type { Event } from "@sentry/types";

declare global {
  interface Window {
    LD?: LDClient;
    ldClient?: LDClient;
  }
}

const clientSideID = "678d5ee22ab7970a19396424";

const context = {
  kind: "user",
  key: "anonymous",
  name: "Anonymous User",
  anonymous: true,
};

export function LaunchDarklyProvider({ children }: { children: ReactNode }) {
  const [LDProvider, setLDProvider] = useState<any>(null);

  useEffect(() => {
    const initLD = async () => {
      try {
        const LDProvider = await asyncWithLDProvider({
          clientSideID,
          context,
          options: {
            bootstrap: "localStorage",
            sendEventsOnlyForVariation: true,
            evaluationReasons: true,
            diagnosticOptOut: false,
          },
          flags: {
            showErrors: true,
            showPerformance: true,
            showRelease: true,
            showRandoms: true,
          },
        });

        setLDProvider(() => {
          const flags = window.LD?.allFlags() || {};
          Sentry.setContext("feature_flags", flags);
          
          (window as any).ldClient = window.LD;

          window.LD?.on("change", () => {
            const updatedFlags = window.LD?.allFlags() || {};
            Sentry.setContext("feature_flags", updatedFlags);
            
            Object.entries(updatedFlags).forEach(([key, value]) => {
              Sentry.setTag(`feature_flag_${key}`, String(value));
            });
          });

          return LDProvider;
        });

        Sentry.addGlobalEventProcessor((event: Event) => {
          const currentFlags = window.LD?.allFlags() || {};

          if (!event.tags) {
            event.tags = {};
          }
          Object.entries(currentFlags).forEach(([key, value]) => {
            event.tags![`feature_flag_${key}`] = String(value);
          });

          if (event.exception || event.message) {
            window.LD?.track("sentry errors", {
              errorType: event.type,
              errorMessage: event.message || "Unknown error",
              timestamp: new Date().toISOString(),
              featureFlags: currentFlags
            });
          }

          return event;
        });

      } catch (error) {
        console.error('Failed to initialize LaunchDarkly:', error);
        // Return a basic provider that just renders children
        setLDProvider(() => ({ children }: { children: ReactNode }) => <>{children}</>);
      }
    };

    initLD();

    return () => {
      Sentry.setContext("feature_flags", null);
    };
  }, []);

  if (!LDProvider) {
    // Return null or a loading state
    return null;
  }

  return <LDProvider>{children}</LDProvider>;
}
