import * as Sentry from "@sentry/nextjs";

export function initSentryMonitoring() {
  // Create a custom transaction for monitoring
  const transaction = Sentry.startTransaction({
    name: 'periodic-health-check',
    op: 'monitoring',
  });

  return {
    // Monitor specific endpoint or task
    monitorEndpoint: async (url: string) => {
      const span = transaction.startChild({
        op: 'http.client',
        description: `GET ${url}`,
      });

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        span.setStatus('ok');
      } catch (error) {
        span.setStatus('error');
        Sentry.captureException(error);
        throw error;
      } finally {
        span.finish();
      }
    },

    // End monitoring session
    finish: () => {
      transaction.finish();
    }
  };
} 