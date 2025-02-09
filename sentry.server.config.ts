import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
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
  environment: process.env.NODE_ENV || "development",
  
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
