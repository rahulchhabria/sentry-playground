import * as Sentry from "@sentry/nextjs";

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
    new Sentry.BrowserTracing({
      traceFetch: true,
      traceXHR: true,
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
    const replay = scope?.getAttachment('replay_id');
    if (replay) {
      event.contexts.replay = { replay_id: replay };
    }

    return event;
  },
});