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
  
  // Enable all features
  enabled: true,
  debug: true,
  
  // Performance Monitoring
  tracesSampleRate: 1.0,
  enableTracing: true,

  // Session Replay (more detailed configuration)
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,

  // Integrations
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      // Capture everything
      maskAllText: false,
      blockAllMedia: false,
      maskAllInputs: false,
      
      // Additional Replay settings
      networkDetailAllowUrls: [/.*/],
      networkCaptureBodies: true,
      networkRequestHeaders: ["*"],
      networkResponseHeaders: ["*"],
      
      // Capture user interactions
      clickDetection: {
        enableRageClick: true,
        enableDeadClick: true,
        rageClickThreshold: 4,
        deadClickTimeout: 10000,
      },
    }),
  ],

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || "development",

  // Allow errors from all origins
  allowUrls: [/.*/],
  
  // Track user interactions
  enableUserInteractionTracing: true,
  enableUserInteractionTracing: {
    idleTimeout: 5000,
    finalTimeout: 30000,
    heartbeatInterval: 5000,
  },

  beforeSend(event) {
    console.log('Sending event to Sentry:', event);
    return event;
  },
});
