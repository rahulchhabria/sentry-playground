"use client";

import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import { ReactNode, useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";

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

      // Initialize feature flag context in Sentry immediately
      window.LD?.getFlags().then((flags: any) => {
        Sentry.setContext("feature_flags", flags);
      });

      // Update Sentry context whenever flags change
      window.LD?.on("change", (flags: any) => {
        // Send updated flag data to Sentry context
        Sentry.setContext("feature_flags", flags);
        
        // Also set flags as tags for better filtering
        Object.entries(flags).forEach(([key, value]) => {
          Sentry.setTag(`feature_flag_${key}`, String(value));
        });
      });

      // Track error events for LaunchDarkly metrics
      Sentry.addGlobalEventProcessor((event) => {
        // Get current flags at the time of the error
        const currentFlags = window.LD?.allFlags() || {};

        // Add feature flags to error event tags
        if (!event.tags) {
          event.tags = {};
        }
        Object.entries(currentFlags).forEach(([key, value]) => {
          event.tags![`feature_flag_${key}`] = String(value);
        });

        if (event.type === "error" || event.type === "exception") {
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

      setLDProvider(() => LDProvider);
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