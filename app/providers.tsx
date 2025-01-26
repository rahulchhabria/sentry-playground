"use client";

import { asyncWithLDProvider, LDClient } from "launchdarkly-react-client-sdk";
import { ReactNode, useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import type { Event } from "@sentry/types";

// Extend Window interface to include our global properties
declare global {
  interface Window {
    LD?: LDClient;
    ldClient?: LDClient;
  }
}

interface ProvidersProps {
  children: ReactNode;
}

const clientSideID = "678d5ee22ab7970a19396424";

// Default user context
const context = {
  kind: "user",
  key: "anonymous",
  name: "Anonymous User",
  anonymous: true,
};

export function Providers({ children }: ProvidersProps) {
  const [LDProvider, setLDProvider] = useState<any>(null);

  useEffect(() => {
    const initLD = async () => {
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

      // Store the client globally for Sentry feature flag adapter
      setLDProvider(() => {
        // After the provider is set up, we can access window.LD
        const flags = window.LD?.allFlags() || {};
        Sentry.setContext("feature_flags", flags);
        
        // Store the client globally for Sentry feature flag adapter
        (window as any).ldClient = window.LD;

        // Update Sentry context whenever flags change
        window.LD?.on("change", () => {
          const updatedFlags = window.LD?.allFlags() || {};
          Sentry.setContext("feature_flags", updatedFlags);
          
          // Also set flags as tags for better filtering
          Object.entries(updatedFlags).forEach(([key, value]) => {
            Sentry.setTag(`feature_flag_${key}`, String(value));
          });
        });

        return LDProvider;
      });

      // Track error events for LaunchDarkly metrics
      Sentry.addGlobalEventProcessor((event: Event) => {
        // Get current flags at the time of the error
        const currentFlags = window.LD?.allFlags() || {};

        // Add feature flags to error event tags
        if (!event.tags) {
          event.tags = {};
        }
        Object.entries(currentFlags).forEach(([key, value]) => {
          event.tags![`feature_flag_${key}`] = String(value);
        });

        if (event.exception || event.message) {
          // Track the error event in LaunchDarkly
          window.LD?.track("sentry errors", {
            errorType: event.type,
            errorMessage: event.message || "Unknown error",
            timestamp: new Date().toISOString(),
            featureFlags: currentFlags // Include flag state with error
          });
        }

        return event;
      });

    };

    initLD();

    // Cleanup function
    return () => {
      // Clear feature flag context when component unmounts
      Sentry.setContext("feature_flags", null);
    };
  }, []);

  if (!LDProvider) {
    return null;
  }

  return <LDProvider>{children}</LDProvider>;
}
