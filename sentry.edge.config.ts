import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Enable Sentry in all environments
  enabled: true,

  // Set different configurations based on environment
  ...(process.env.NODE_ENV === 'development' ? {
    beforeSend(event) {
      console.log('Sending event to Sentry:', event);
      return event;
    },
  } : {}),
  
  // Set environment
  environment: process.env.NODE_ENV || "development",
  
  // Enable performance monitoring
  tracesSampleRate: 1.0,
});
