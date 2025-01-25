import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from "@sentry/nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const transaction = Sentry.startTransaction({
    name: 'health-check',
    op: 'health',
  });

  try {
    // Add your health check logic here
    // For example, check database connection, external services, etc.
    
    // Sample health checks
    const checks = {
      database: true, // Replace with actual DB check
      api: true,      // Replace with actual API check
      cache: true,    // Replace with actual cache check
    };

    const isHealthy = Object.values(checks).every(Boolean);

    if (!isHealthy) {
      throw new Error('System health check failed');
    }

    transaction.setStatus('ok');
    res.status(200).json({ status: 'healthy', checks });
  } catch (error) {
    transaction.setStatus('error');
    Sentry.captureException(error);
    res.status(503).json({ status: 'unhealthy', error: error.message });
  } finally {
    transaction.finish();
  }
} 