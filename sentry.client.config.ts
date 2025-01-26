import * as Sentry from "@sentry/nextjs";

// Feature flag adapter for LaunchDarkly
const featureFlagAdapter = {
  getFlags: async () => {
    try {
      // Get the LaunchDarkly client from window
      const ldClient = (window as any).ldClient;
      if (!ldClient) {
        return {};
      }
      
      // Get all flags and their values
      const allFlags = await ldClient.allFlags();
      // Format flags according to Sentry's dev toolbar requirements
      return Object.entries(allFlags).reduce((acc, [key, value]) => {
        acc[key] = {
          name: key,
          value: Boolean(value)
        };
        return acc;
      }, {} as Record<string, { name: string; value: boolean }>);
    } catch (error) {
      console.error("Error getting feature flags:", error);
      return {};
    }
  }
};

Sentry.init({
  dsn: "https://891119ef51d56b1a8c9193f32047d068@o4506312335294464.ingest.us.sentry.io/4508672160628736",
  
  // Enable debug mode to see verbose logging
  debug: true,
  
  // Ensure Sentry is enabled in all environments
  enabled: true,
  
  // Set environment
  environment: process.env.NODE_ENV || "development",
  
  // Initialize integrations
  integrations: [
    // Add feature flag adapter for dev toolbar
    {
      name: "feature-flags",
      setupOnce: (addGlobalEventProcessor: (callback: (event: any) => Promise<any>) => void) => {
        // Register the feature flag adapter with Sentry's dev tools
        if (typeof window !== 'undefined') {
          // Register the feature flag adapter with Sentry's dev tools
          (window as any).__SENTRY__ = (window as any).__SENTRY__ || {};
          (window as any).__SENTRY__.devtools = (window as any).__SENTRY__.devtools || {};
          (window as any).__SENTRY__.devtools.featureFlags = {
            enabled: true,
            getFeatureFlags: async () => {
              try {
                const allFlags = await featureFlagAdapter.getFlags();
                return {
                  flags: Object.entries(allFlags).map(([key, value]) => ({
                    id: key,
                    name: key,
                    variant: {
                      value: value.value,
                      status: 'active'
                    }
                  })),
                  hasError: false
                };
              } catch (error: any) {
                return {
                  flags: [],
                  hasError: true,
                  errorMessage: error?.message || 'Unknown error'
                };
              }
            }
          };

          // Also expose the feature flags globally for Sentry's dev toolbar
          (window as any).__SENTRY_DEVTOOLS__ = {
            featureFlags: {
              enabled: true,
              getFeatureFlags: async () => {
                try {
                  const allFlags = await featureFlagAdapter.getFlags();
                  return {
                    flags: Object.entries(allFlags).map(([key, value]) => ({
                      id: key,
                      name: key,
                      variant: {
                        value: value.value,
                        status: 'active'
                      }
                    })),
                    hasError: false
                  };
                } catch (error: any) {
                  return {
                    flags: [],
                    hasError: true,
                    errorMessage: error?.message || 'Unknown error'
                  };
                }
              }
            }
          };
        }
        
        // Also add flags to event contexts
        addGlobalEventProcessor(async (event) => {
          try {
            const flags = await featureFlagAdapter.getFlags();
            event.contexts = event.contexts || {};
            event.contexts['feature-flags'] = flags;
          } catch (e) {
            console.error('Error processing feature flags:', e);
          }
          return event;
        });
      }
    },
    new Sentry.BrowserTracing({
      tracingOrigins: ["localhost", /^\//],
      startTransactionOnLocationChange: true,
      startTransactionOnPageLoad: true,
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
      maskAllInputs: true,
      networkDetailAllowUrls: ["*"],
      networkCaptureBodies: true,
    }),
  ],

  // Performance sample rates
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,

  // Session tracking
  autoSessionTracking: true,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || "development",

  // Ensure breadcrumbs are captured
  maxBreadcrumbs: 100,
  attachStacktrace: true,

  // Initialize performance monitoring
  enableTracing: true,

  // Ensure errors are always sent
  beforeSend(event) {
    // Log the event being sent (for debugging)
    console.log("Sending event to Sentry:", event);

    if (!event.contexts) {
      event.contexts = {};
    }

    // Add replay context if available
    const scope = Sentry.getCurrentHub()?.getScope();
    if (scope) {
      const replay = scope.getAttachments?.()?.length ? scope.getAttachments?.()[0] : null;
      if (replay) {
        event.contexts.replay = { replay_id: replay };
      }
    }

    return event;
  },
});
