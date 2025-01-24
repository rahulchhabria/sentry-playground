import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://891119ef51d56b1a8c9193f32047d068@o4506312335294464.ingest.us.sentry.io/4508672160628736",
  
  // Enable debug mode
  debug: true,
  
  // Ensure Sentry is enabled
  enabled: true,
  
  // Set environment
  environment: process.env.NODE_ENV || "development",
  
  // Enable performance monitoring
  tracesSampleRate: 1.0,
});