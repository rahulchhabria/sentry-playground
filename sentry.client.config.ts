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
  dsn: "https://891119ef51d56b1a8c9193f32047d068@o4506312335294464.ingest.sentry.io/4508672160628736",
  
  enabled: true,
  debug: true,
  
  tracesSampleRate: 1.0,
  enableTracing: true,

  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,

  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || "development",

  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", /^https:\/\//],
    }),
    new Sentry.Replay({
      // Privacy settings
      maskAllText: false,
      blockAllMedia: false,
      maskAllInputs: false,
      
      // Session settings
      stickySession: true,
      
      // Network monitoring
      networkDetailAllowUrls: ["*"],
      networkCaptureBodies: true,
      networkRequestHeaders: ["*"],
      networkResponseHeaders: ["*"],

      // Click detection is part of the default behavior of Replay
      // No specific configuration needed for basic click detection

      // Duration settings
      minReplayDuration: 1000,
      maxReplayDuration: 3600000
    })
  ],

  initialScope: {
    user: { 
      id: `user_${Math.random().toString(36).slice(2)}`,
      ip_address: "{{auto}}"
    },
    tags: { 
      session_id: `session_${Date.now()}`
    }
  }
});


