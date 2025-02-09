import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://891119ef51d56b1a8c9193f32047d068@o4506312335294464.ingest.us.sentry.io/4508672160628736",
  
  // Enable Sentry in all environments
  enabled: true,

  // Set different configurations based on environment
  ...(process.env.NODE_ENV === 'development' ? {
    beforeSend(event) {
      console.log('Sending event to Sentry (server):', event);
      return event;
    },
  } : {}),
  
  // Set environment
  environment: process.env.NODE_ENV,
  
  // Enable performance monitoring
  tracesSampleRate: 1.0,
  
  // Set release version
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || "development",
  
  // Enable session tracking
  autoSessionTracking: true,

  // Initialize performance monitoring
  enableTracing: true,

  // Ensure errors are always sent
  beforeSend(event) {
    // Log the event being sent (for debugging)
    console.log("Sending event to Sentry (server):", event);
    return event;
  },
});
